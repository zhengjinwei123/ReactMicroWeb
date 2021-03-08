create database if not exists `db_workflow`;

use db_workflow;

drop table if exists `t_task`;
drop table if exists `t_user_task`;
drop table if exists `t_task_log`;

CREATE TABLE  `t_task` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `name` varchar(1024) NOT NULL DEFAULT '' COMMENT '任务描述',
    `promoter` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '发起者',
    `acceptor` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '验收者',
    `relaters` varchar(1024) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '关联的用户列表,按逗号分隔',
    `start_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '开始时间',
    `finish_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '结束时间',
    `accept_time` bigint(10) NOT NULL DEFAULT 0 COMMENT '验收时间',
    `predict_cost_minute` int(10) NOT NULL DEFAULT 0 COMMENT '预估耗时,单位分钟',
    `files` varchar(1024) NOT NULL DEFAULT '' COMMENT '关联的文件名, 按逗号分隔',
    `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '任务状态 0:未开始 1：进行中 2：测试中 3： 已完成  4：验收完毕',
    `modify_time` datetime NOT NULL  COMMENT '更新时间',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_status`(`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE  `t_user_task` (
    `user_name` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '用户名',
    `task_id` int(10) NOT NULL DEFAULT 0 COMMENT '任务id',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`user_name`,`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE  `t_task_log` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `task_id` int(10) NOT NULL DEFAULT 0 COMMENT '任务id',
    `operator` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '操作者',
    `content` varchar(1024) NOT NULL DEFAULT '' COMMENT '日志内容',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_task_id` (`task_id`),
    KEY `idx_operator` (`operator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

