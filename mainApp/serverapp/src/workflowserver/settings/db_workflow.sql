create database if not exists `db_workflow`;

use db_workflow;

drop table if exists `t_task`;
drop table if exists `t_user_task`;

CREATE TABLE  `t_task` (
    `task_id` bigint(10) NOT NULL DEFAULT 0,
    `task_name` varchar(250) NOT NULL DEFAULT '' COMMENT '任务名称',
    `task_desc` varchar(1024) NOT NULL DEFAULT '' COMMENT '任务描述',
    `promoter` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '发起者',
    `relaters` varchar(1024) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '关联的用户列表,按逗号分隔',
    `dead_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '截止时间',
    `priority` tinyint(1) NOT NULL DEFAULT 0 COMMENT '优先级 3:紧急 2:高 1: 低',
    `files` varchar(1024) NOT NULL DEFAULT '' COMMENT '关联的文件名, 按逗号分隔',
    `done` tinyint(1) NOT NULL DEFAULT 0 COMMENT '完成状态， 当relaters的任务都完成时 自动归档',
    `modify_time` datetime NOT NULL  COMMENT '更新时间',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`task_id`),
    unique key (`task_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE  `t_user_task` (
    `user_name` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '用户名',
    `task_id` bigint(10) NOT NULL DEFAULT 0 COMMENT '任务id',
    `predict_cost_minute` int(10) NOT NULL DEFAULT 0 COMMENT '预估耗时,单位分钟',
    `start_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '开始时间',
    `finish_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '完成时间',
    `acceptors` varchar(1024) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '验收者',
    `accept_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '验收时间',
    `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '任务状态 0:待处理 1：进行中 2：完成 3：测试中  4：验收完毕',
    `modify_time` datetime NOT NULL  COMMENT '更新时间',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`user_name`,`task_id`),
    KEY `idx_status`(`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



