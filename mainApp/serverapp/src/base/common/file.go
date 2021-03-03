package common

import (
	"errors"
	"io/ioutil"
	"os"
	"strings"
)

func FileGetContent(file_path_name string) (string, error) {
	contents, err := ioutil.ReadFile(file_path_name);
	if err != nil {
		return "", err
	}

	return string(contents), err
}

func FilePutContents(file_path_name string, contents string) error {
	err := ioutil.WriteFile(file_path_name, []byte(contents), 0644)
	return err
}

func FileExists(file_path_name string) bool {
	var exists = true
	if _, err := os.Stat(file_path_name); os.IsNotExist(err) {
		exists = false
	}
	return exists
}

func CreateDir(dir_path string) bool {
	err := os.MkdirAll(dir_path, os.ModePerm)
	return err == nil
}

func DeleteFile(file_path string) error {
	if FileExists(file_path) {
		err := os.Remove(file_path)
		return err
	}
	return errors.New("file not exists")
}

func GetDirFiles(dirPth string, suffix string)  (files []string, err error) {
	files = make([]string, 0)

	dir, err := ioutil.ReadDir(dirPth)
	if err != nil {
		return nil, err
	}

	//PthSep := string(os.PathSeparator)
	suffix = strings.ToUpper(suffix) //忽略后缀匹配的大小写

	for _, fi := range dir {
		if fi.IsDir() { // 忽略目录
			continue
		}
		if strings.HasSuffix(strings.ToUpper(fi.Name()), suffix) { //匹配文件
			//files = append(files, dirPth+PthSep+fi.Name())
			files = append(files, fi.Name())
		}
	}

	return files, nil
}