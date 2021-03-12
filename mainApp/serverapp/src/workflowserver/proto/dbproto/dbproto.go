package dbproto

type DbTaskTableInfo struct {
	TaskId int64 `db:"task_id"`
	TaskName string `db:"task_name"`
	TaskDesc string `db:"task_desc"`
	Promoter string `db:"promoter"`
	Relaters string `db:"relaters"`
	DeadTime int64 `db:"dead_time"`
	Priority int `db:"priority"`
	Files string `db:"files"`
	Done int `db:"done"`
	CreateTime string `db:"create_time"`
	ModifyTime string `db:"modify_time"`
}

type DbUserTaskTableInfo struct {
	UserName string `db:"user_name"`
	TaskId int64 `db:"task_id"`
	PredictCostMinute int `db:"predict_cost_minute"`
	Start_time int64 `db:"start_time"`
	FinishTime int64 `db:"finish_time"`
	Acceptors string `db:"acceptors"`
	AcceptTime int64 `db:"accept_time"`
	Status int `db:"status"`
	ModifyTime string `db:"modify_time"`
	CreateTime string `db:"create_time"`
}