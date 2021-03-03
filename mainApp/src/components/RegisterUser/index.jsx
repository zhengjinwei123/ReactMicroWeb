import React from 'react';
import {register } from "../../services/user"
import md5 from "js-md5"

import {
    Form,
    Input,
    Tooltip,
    Button,
    message,
    Select
  } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: 400,
}

const formItemLayout = {
    labelCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 8,
        },
    },
    wrapperCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 16,
        offset: 8,
        },
    },
};
  
const RegistrationForm = ({user_groups}) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
    //   console.log('Received values of form: ', values);
      values.password = md5(values.password)

      register(values, (err, data) => {
        if (err) {
            message.error(err)
            return;
          }
          message.info("注册成功")
          form.resetFields();
      })
    };

    return (
      <Form
        {...formItemLayout}
        form={form}
        style={formStyle}
        name="register"
        onFinish={onFinish}
        initialValues={{
        }}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label={
            <span>
              用户名&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: 'Please input your username!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
  
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="email"
          label="电子邮箱"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="用户组" name="group_id"
             rules={[
                {
                  required: true,
                  message: 'Please Select user group!',
                },
              ]}
        >
          <Select>
            {
                user_groups.map((v, k) => {
                    return (<Select.Option value={v.group_id} key={k}>{v.group_name}</Select.Option>)
                })
            }
            
          </Select>
        </Form.Item>
       
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  };

  export default RegistrationForm