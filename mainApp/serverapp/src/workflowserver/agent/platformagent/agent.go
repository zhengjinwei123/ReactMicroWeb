package platformagent

import (
	"net/url"
	"serverapp/src/workflowserver/agent"
)

func GetUserList() ([]byte, error) {

	resp, err := agent.PostPlatform("/agent/users", url.Values{})
	if err != nil {

		return nil, err
	}

	return resp, nil
}