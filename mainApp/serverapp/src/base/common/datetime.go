package common

import "time"

func NowTimeIn(location string) (time.Time, error){
	loc, err := time.LoadLocation(location)
	if err != nil {
		return time.Now(), err
	}

	return time.Now().In(loc), nil
}

func UnixStampToDateString(stamp int64, location string) string {
	if stamp == 0 {
		return ""
	}
	t := time.Unix(stamp, 0)
	loc, err := time.LoadLocation(location)
	if err != nil {
		return ""
	}
	return t.In(loc).Format("2006-01-02 03:04:05")
}

func DateFormatToUnix(dateStr string, location string) time.Time {
	timeTemplate := "2006-01-02 15:04:05"
	t, err := time.ParseInLocation(timeTemplate, dateStr, time.FixedZone(location, 0))
	if err != nil {
		return time.Now()
	}
	return t
}

func GetNowDateString(location string) string {
	now, _ := NowTimeIn(location)
	dateTime := now.Format("2006-01-02 03:04:05")
	return dateTime
}