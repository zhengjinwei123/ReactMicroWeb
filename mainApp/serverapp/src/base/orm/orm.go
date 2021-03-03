package orm

import (
	"errors"
	"log"
	"net/url"
	"reflect"
	"strconv"
)

func TypeDeref(t reflect.Type) reflect.Type {
	if t == nil {
		return nil
	}
	if t.Kind() != reflect.Ptr && t.Kind() != reflect.Interface {
		return t
	}
	return TypeDeref(t.Elem())
}

func ValueDeref(v reflect.Value) reflect.Value {
	if !v.IsValid() {
		return v
	}
	if v.Kind() != reflect.Ptr && v.Kind() != reflect.Interface {
		return v
	}
	if v.IsNil() || (v.Elem().Kind() == reflect.Invalid) {
		return reflect.Value{}
	}
	return ValueDeref(v.Elem())
}

func UnmarshalHttpValues(i interface{}, form url.Values) error {
	if i == nil {
		return errors.New("i is nil")
	}

	rv := ValueDeref(reflect.ValueOf(i))
	if !rv.IsValid() {
		return errors.New("reflect is not valid")
	}
	if rv.Kind() != reflect.Struct {
		return errors.New("i is not point to struct")
	}

	rt := TypeDeref(rv.Type())

	get_key := func(i int) string {
		ft := rt.Field(i)
		key := ft.Tag.Get("http")
		if key != "" {
			return key
		}
		return ft.Name
	}

	num := rt.NumField()
	for i := 0; i < num; i++ {
		field := rv.Field(i)
		key := get_key(i)
		if key == "" || key == "-" {
			continue
		}
		value := form.Get(key)
		if value == "" {
			continue
		}
		switch field.Kind() {
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			v, err := strconv.ParseInt(value, 10, 64)
			if err != nil {
				return err
			}
			field.SetInt(v)
		case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
			v, err := strconv.ParseUint(value, 10, 64)
			if err != nil {
				return err
			}
			field.SetUint(v)
		case reflect.Bool:
			v, err := strconv.ParseBool(value)
			if err != nil {
				return err
			}
			field.SetBool(v)
		case reflect.Float32, reflect.Float64:
			v, err := strconv.ParseFloat(value, 64)
			if err != nil {
				return err
			}
			field.SetFloat(v)
		case reflect.String:
			field.SetString(value)
		default:
			continue
		}
	}

	log.Printf("unmarshal httpvalues: %v \n", i)
	return nil
}
