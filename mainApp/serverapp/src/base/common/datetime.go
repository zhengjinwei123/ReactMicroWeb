package common

import "time"

func NowTimeIn(location string) (time.Time, error){
	loc, err := time.LoadLocation(location)
	if err != nil {
		return time.Now(), err
	}

	return time.Now().In(loc), nil
}