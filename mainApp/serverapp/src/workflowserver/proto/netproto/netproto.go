package netproto

type NetTaskUpdateRequest struct {
	TaskId string `http:"id"`
	Status int `http:"status"`
}

type H map[string]interface{}