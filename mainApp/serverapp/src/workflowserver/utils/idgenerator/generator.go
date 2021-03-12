package idgenerator

import (
	"github.com/gitstliu/go-id-worker"
)

var g_idworker *idworker.IdWorker = nil

func InitIdWorker() error {
	g_idworker = &idworker.IdWorker{}
	return g_idworker.InitIdWorker(1000, 1)
}

func GetNextId() (int64, error) {
	newId, err := g_idworker.NextId()
	return newId, err
}