create database if not exists `db_platform`;

use db_platform;
drop table if exists `t_user`;
drop table if exists `t_group`;

CREATE TABLE  `t_group` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `desc` varchar(40) NOT NULL DEFAULT '' COMMENT '描述',
    `menus` varchar(1024) NOT NULL DEFAULT '' COMMENT '菜单列表',
    `auths` varchar(1024) NOT NULL DEFAULT '' COMMENT '权限url列表',
    PRIMARY KEY (`id`),
    UNIQUE KEY (`desc`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `t_user` (
  `username` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(33) NOT NULL DEFAULT '' COMMENT '密码',
  `email` varchar(25) NOT NULL DEFAULT '' COMMENT '邮箱',
  `group_id` int(10) NOT NULL DEFAULT 1 COMMENT '所属组ID',
  `nickname` varchar(25) NOT NULL DEFAULT '' COMMENT '昵称',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '封禁状态: 1 封禁 0 正常',
  PRIMARY KEY (`username`),
  FOREIGN KEY(`group_id`) REFERENCES `t_group`(`id`),
  UNIQUE KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert into t_group(`id`,`desc`,`menus`,`auths`) VALUES(1,"管理员","","");
insert into t_user(`username`,`password`, `nickname`, `email`, `group_id`) VALUES("admin", "e10adc3949ba59abbe56e057f20f883e", "管理员",  "2538698032@qq.com", 1);
