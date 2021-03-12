package agent

import (
	"crypto/md5"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"serverapp/src/workflowserver/config"
	"sort"
	"strings"
	//l4g "serverapp/src/base/log4go"
)

func sign(params url.Values) string {

	keys := make([]string, 0, len(params))

	for k, _ := range params {
		keys = append(keys, k)
	}

	sort.Strings(keys)

	dataList := make([]string, 0, len(keys))
	for _, k := range keys {
		v := params[k]

		dataList = append(dataList, fmt.Sprintf("%s=%s", k, v))
	}

	ret := fmt.Sprintf("%s#%s", strings.Join(dataList, "#"), config.GetServerConfig().PlatformServer.SecretKey)
	return fmt.Sprintf("%x", md5.Sum([]byte(ret)))
}

func PostPlatform(url string, params url.Values) ([]byte, error) {

	url = fmt.Sprintf("%s%s", config.GetServerConfig().PlatformServer.Addr, url)

	sig := sign(params)
	params["sign"] = []string{sig}

	resp, err := http.PostForm(url, params)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body,  nil
}