# ReactMicroWeb
阿里qiankun微前端框架实践

```
1. 使用阿里 微前端框架qiankun(qiankun)
2. 主应用： React + sessionStorage + redux + router
3. 主应用实现菜单管理，路由权限管理，后端使用golang 语言开发，go-chi http 框架， redis 存储session（子应用需要在多点登录）, mysql 存储数据
4. 子应用： React
```

##### 按以下步骤启动

### 1. 主应用服务器启动

```
1. 进入mainApp/serverapp/src/workflowserver
2. go build 编译执行
3. 将生成的二进制文件 拷贝到 bin 目录下
4. 执行settings/db_workflow.sql 文件， 初始化数据库
5. 配置好 settings/config.xml (mysql,  redis)
6. 进入 bin 目录 执行二进制文件即可
```

### 2. 启动子应用

```
1. cd workflowApp
2. yarn install
3. yarn start
```

### 3. 启动主应用

```
1. cd mainApp
2. yarn install
3. yarn start
```