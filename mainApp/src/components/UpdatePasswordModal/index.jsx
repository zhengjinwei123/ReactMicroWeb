import { Input, Form, Button, message,Modal } from 'antd';
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {Translate} from "../helper/index.jsx"
import { UpdatePassword } from "../../services/user"
import md5 from "js-md5"

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
};

const UpdatePasswordModal = forwardRef((props, ref) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [username, setUsername] = useState("")

   
    const [updatePasswordForm] = Form.useForm();

    const showUpdatePasswordModal = (show, username) => {
        setIsModalVisible(show);
        setUsername(username)
        updatePasswordForm.resetFields();
    }

    const onUpdatePasswordModalFinish = (values) => {

        console.log(md5(values.password), username)
        
        UpdatePassword(username, md5(values.password), (err, data) => {
            if (err) {
                message.error(err)
            } else {
                message.success("success")
                setIsModalVisible(false);
            }
        })
    }

    useImperativeHandle(ref, () => ({
        showUpdatePasswordModal
    }));

    return (
        <Modal footer={null} maskClosable={false} title={<Translate id="updatePassword"/>} visible={isModalVisible}  onCancel={() => showUpdatePasswordModal(false, username)}>
            <Form
                {...layout}
                name="update_password_dialog"
                onFinish={onUpdatePasswordModalFinish}
                form={updatePasswordForm}
                >

                <Form.Item label={<Translate id="password"/>}
                    name="password" rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label={ <Translate id="confirmPassword"/>}
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

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                    <Translate id="submit"/>
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
})

export default UpdatePasswordModal
