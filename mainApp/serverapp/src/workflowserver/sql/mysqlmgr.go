package sql

import (
	"database/sql"
	"errors"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"log"
	l4g "serverapp/src/base/log4go"
)

type mysqlProxy struct {
	proxy *sqlx.DB
}

func (this *mysqlProxy) Init(addr string) error {
	var err error
	this.proxy, err = sqlx.Open("mysql", addr)
	if err != nil {
		l4g.Error("init mysql error: %s %v \n", addr, err)
		return err;
	}

	err = this.proxy.Ping()

	return err
}

func (this *mysqlProxy) Close() {
	if this.proxy != nil {
		err := this.proxy.Close()
		if err != nil {
			l4g.Error("close mysql error: %v \n", err)
		}
		this.proxy = nil
	}
}

func (this *mysqlProxy) Insert(sql string) error {
	if _, err := this.proxy.Exec(sql); err != nil {
		l4g.Error("Exec mysql error: %s %v \n", sql, err)
		return err
	}
	return nil
}

func (this *mysqlProxy) GetCount(sql string) (int, error) {
	rows, err := this.proxy.Query(sql)
	if err != nil {
		return 0, err
	}

	count := 0
	for rows.Next(){
		count += 1
	}

	return count, nil
}

func (this *mysqlProxy) GetCount2(field, table string, where string) (int, error) {
	sqlStr := fmt.Sprintf("select count(`%s`) as cnt from %s", field, table)

	if where != "" {
		sqlStr += (" where " + where)
	}
	rows, err := this.proxy.Query(sqlStr)

	if err != nil {
		return 0, err
	}

	for rows.Next(){
		var num  int
		err := rows.Scan(&num)
		if err != nil {
			return 0, err
		}

		return num, nil
	}

	return 0, err
}

func (this *mysqlProxy) QueryOne(sql string, v interface{}) error {
	err := this.proxy.Get(v, sql)
	return err
}

func (this *mysqlProxy) QueryList(sql string, v interface{}) error {
	err := this.proxy.Select(v, sql)
	return err
}

func (this *mysqlProxy) Update(sql string, args ...interface{}) (error, int64) {
	results, err := this.proxy.Exec(sql, args...)
	if err != nil {
		return err, 0
	}
	affectedN, err := results.RowsAffected()
	if err != nil {
		return err, 0
	}
	return nil, affectedN
}

func (this *mysqlProxy) Delete(sql string, args ...interface{}) (error, int64) {
	results, err := this.proxy.Exec(sql, args...)
	if err != nil {
		return err, 0
	}
	affectedN, err := results.RowsAffected()
	if err != nil {
		return err, 0
	}
	return nil, affectedN
}

func (this *mysqlProxy) clearTransaction(tx *sqlx.Tx) {
	err := tx.Rollback()
	if err != sql.ErrTxDone && err != nil {
		log.Println(err)
	}
}

func mysql_escape(source string) (string, error) {
	var j int = 0
	if len(source) == 0 {
		return "", errors.New("source is null")
	}
	tempStr := source[:]
	desc := make([]byte, len(tempStr)*2)
	for i := 0; i < len(tempStr); i++ {
		flag := false
		var escape byte
		switch tempStr[i] {
		case '\r':
			flag = true
			escape = '\r'
			break
		case '\n':
			flag = true
			escape = '\n'
			break
		case '\\':
			flag = true
			escape = '\\'
			break
		case '\'':
			flag = true
			escape = '\''
			break
		case '"':
			flag = true
			escape = '"'
			break
		case '\032':
			flag = true
			escape = 'Z'
			break
		default:
		}
		if flag {
			desc[j] = '\\'
			desc[j+1] = escape
			j = j + 2
		} else {
			desc[j] = tempStr[i]
			j = j + 1
		}
	}
	return string(desc[0:j]), nil
}

func (this *mysqlProxy) UpdateMulti(sql []string) (error) {
	//tx, err := this.proxy.Beginx()
	//defer this.clearTransaction(tx)
	//if err != nil {
	//	log.Fatalln(err)
	//	return err
	//}
	//
	//rs, err := tx.Exec(sql, args...)
	//if err != nil {
	//	return err
	//}
	//
	//if err != nil {
	//	log.Fatalln(err)
	//	return err
	//}


	//if err := tx.Commit(); err != nil {
	//	// tx.Rollback() 此时处理错误，会忽略doSomthing的异常
	//	log.Fatalln(err)
	//}

	return nil
}


func NewMysqlProxy() *mysqlProxy {
	proxy := &mysqlProxy{
		proxy: nil,
	}
	return proxy
}

// export
var myProxy = NewMysqlProxy()
func GetMysqlProxy() *mysqlProxy {
	return myProxy
}