package common

import (
	"errors"
	"fmt"
	"runtime"
)

func PanicExt(format string, args ...interface{}) {
	info := fmt.Sprintf(format, args...)
	_, f, l, ok := runtime.Caller(1)
	if ok {
		info = fmt.Sprintf("[%s/%d]: %s", f, l, info)
	}
	panic(info)
}

func NewError(format string, args ...interface{}) error {
	err_str := fmt.Sprintf(format, args...)
	return errors.New(err_str)
}
