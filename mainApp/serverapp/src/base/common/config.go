package common

import (
	"encoding/json"
	"encoding/xml"
	"io/ioutil"
)

func LoadConfig(filename string, v interface{}) error {
	if contents, err := ioutil.ReadFile(filename); err != nil {
		return err
	} else {
		if err = xml.Unmarshal(contents, v); err != nil {
			return err
		}
		return nil
	}
}

func LoadJsonConfig(filename string, v interface{}) error {
	contents, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}
	err = json.Unmarshal(contents, v)
	if err != nil {
		return err
	}
	return nil
}

func SaveConfig(filename string, v interface{}) error {
	if contents, err := xml.Marshal(v); err != nil {
		return err
	} else {
		if err = ioutil.WriteFile(filename, contents, 0644); err != nil {
			return err
		}
		return nil
	}
}
