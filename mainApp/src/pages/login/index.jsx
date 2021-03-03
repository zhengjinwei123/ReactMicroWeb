import React, {useState, useEffect} from "react"
import {Form, Input, Button, Checkbox, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import {login, setUserLogin, checkUserHasLogin } from "../../services/user"
import { redirectTo } from "../../utils/util"
import {withRouter} from "react-router-dom";
import { Helmet } from "react-helmet"
import _ from "lodash"
import md5 from "js-md5"

const loginFormStyle = {
    display: 'flex',
    width: 400,
    height: 400,
    boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #E3E3E3',
    margintop: 200,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    background: "url('/img/logo.png') #FFF no-repeat 16px 16px",
    marginTop: 80,
}

const account_key = "x2-gm-key-account"
const account_password = "x2-gm-key-password"

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignitems: 'center',
    paddingTop: 30,
    margin: '0 auto',
    textAlign: 'center'
}

const Login = ({ userinfoActions, userinfo }) => {

    // console.log("login userinfo", userinfo)

    if (checkUserHasLogin()) {
        redirectTo("/dashboard")
        return;
    }
    // if (!_.isEmpty(userinfo) && !_.isEmpty(userinfo.username)) {
    //     redirectTo("/dashboard")
    //     return;
    // }

    const [rememberMe, setRememberMe] = useState(true)
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

  
    const onReset = () => {
        form.resetFields();
    }

    const onLogin = () => {
        const username = form.getFieldValue('username')
        const password = form.getFieldValue('password')

        if (_.isEmpty(username) || _.isEmpty(password)) {
            return;
        }

        login({username: username, password: md5(password)}, function(err, data) {
            if (err) {
                message.error(err)
            } else {
                if (rememberMe) {
                    window.localStorage.setItem(account_key, username)
                    window.localStorage.setItem(account_password, password)
                } else {
                    window.localStorage.removeItem(account_key)
                    window.localStorage.removeItem(account_password)
                }

                setUserLogin({
                    username
                })

                userinfoActions.login({
                    username: username,
                    menus: data.menus
                })

                redirectTo("/dashboard")
            }
        })
    }

    const rememberChange = (e) => {
        setRememberMe(e.target.checked)
    }

    const autoFillAccount = (e) => {

        let username = e ? e.target.value : ""
        if (window && window.localStorage) {
            const account = window.localStorage.getItem(account_key)
            const password = window.localStorage.getItem(account_password)

            if (username && account && password) {

                if (username === account) {
                    form.setFieldsValue({
                        "password": password
                    })
                } else {
                    form.setFieldsValue({
                        "password": ""
                    })
                }
                
            } else {
                if (account && password) {
                    form.setFieldsValue({
                        "username": account,
                        "password": password
                    })
                }
            }
        }
    }

    useEffect( () => {
        autoFillAccount()
    }, [])

    return (
        <>
            <Helmet>
                <title>X2GAME 游戏管理系统-登录</title>
            </Helmet>
            <div className="container">
            <div style={loginFormStyle}>
                <Form
                    form={form}
                    style={formStyle}
                    name="login_form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        onChange={autoFillAccount}
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                        ]}><Input prefix={<UserOutlined  />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}>
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox onChange={rememberChange}>Remember me</Checkbox>
                        </Form.Item>
                        

                        <Button htmlType="button" onClick={onReset}>
                          Reset
                        </Button>

                        <a className="login-form-forgot" href="/#" style={{float: 'right'}}>
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width: '100%'}} onClick={onLogin}>
                        Log in
                        </Button>
                    </Form.Item>               
                </Form>
            </div>
           
            <style jsx>{`
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}
            </style>
            </div>
        </>
    )
}

export default withRouter(Login)