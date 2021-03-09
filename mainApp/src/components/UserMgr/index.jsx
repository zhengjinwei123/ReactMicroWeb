import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button, Space, Select, message, Badge,Modal } from 'antd';
import React, { useState, useEffect,useRef } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Option } = Select;

import {injectIntl} from 'react-intl'

import { GetUserList, BanUser,UpdateEmailAndGroup,DelUser } from "../../services/user"
import UpdatePasswordModal from "../UpdatePasswordModal/index"


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    user_groups,
    onUserGroupChange,
    children,
    ...restProps
  }) => {
    let inputNode = null;
    if (inputType === "number") {
        inputNode = <InputNumber />
    } else if (inputType === "text") {
        inputNode = <Input />
    } else if (inputType === "select") {
        inputNode = <Select onChange={onUserGroupChange}>
            {
                user_groups.map((item, idx) => {
                    let desc = item.group_id + "(" + item.group_name + ")"
                    return (
                        <Option key={idx} value={desc}>{desc}</Option>
                    )
                })
            }
        </Select>
    }

    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
};

const EditableTable = ({user_groups, intl}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    const updatePasswordModalRef = useRef(null)

    const isEditing = (record) => record.key === editingKey;

    const getUserList = () => {
        GetUserList((err, data) => {
            if (!err) {
               
                let tmp = [];
                for (let i = 0; i < data.length; i++) {
                    let obj = data[i]
                    obj.key = obj.user_name;
                    obj.nickname = obj.nickname;
                    obj.status = obj.status;
                    obj.group = obj.group_id + "(" + obj.group_name + ")"
                    tmp.push(obj)
                }
                setData([...tmp]) 
            }
        })
    }

    useEffect(() => {
        getUserList()
    }, [])

    const onUserGroupChange = (value, option) => {
       
    }

    const banUser = (username, status) => {

        console.log(username,status )
        BanUser(username, status, (err, data) => {
            if (!err) {
                getUserList()
            }
        })
    }

    const delUser = (username) => {

      Modal.confirm({
          title: intl.formatMessage({id: "delUser"}),
          icon: <ExclamationCircleOutlined />,
          content: intl.formatMessage({id: "confirmDel"}),
          onOk: () => {
            DelUser(username, (err, data) => {
              if (!err) {
                  getUserList()
              }
            })
          },
          onCancel: () => {

          },
      });
    }

    const edit = (record) => {
      form.setFieldsValue({
        user_name: '',
        email: '',
        status: '',
        group_id: '',
        group_name: '',
        group: '',
        ...record,
      });
      setEditingKey(record.key);
    };
  
    const cancel = () => {
      setEditingKey('');
    };

    const showUpdatePasswordModal = (show, username) => {

        if (updatePasswordModalRef.current) {
            updatePasswordModalRef.current.showUpdatePasswordModal(show, username)
        }
    }


    const save = async (key) => {
      try {
        const row = await form.validateFields();
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
  

        let group_id = 0;
        for (let i = 0; i < user_groups.length; i++) {
            let desc = user_groups[i].group_id + "(" + user_groups[i].group_name + ")"

            if (row.group == desc) {
                group_id = user_groups[i].group_id;
                break;
            }
        }

        if (group_id == 0) {
            return;
        }

        if(!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(row.email))) {
            message.error('请输入正确的Email');
            return;
        }

        UpdateEmailAndGroup(key,  row.email, group_id, row.nickname, (err, data) => {
            if (!err) {
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setData(newData);
                    setEditingKey('');
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey('');
                }
            } else {
                message.error(err)
            }
        })
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const columns = [
        {
          title: 'user_name',
          dataIndex: 'user_name',
          width: '10%',
          editable: false,
        },
        {
          title: 'nickname',
          dataIndex: 'nickname',
          width: '10%',
          editable: true,
        },
        {
          title: 'email',
          dataIndex: 'email',
          width: '10%',
          editable: true,
        },
        {
            title: 'status',
            dataIndex: 'status',
            width: '10%',
            editable: false,
            render: (_, record) => (
                <span>
                  <Badge status={record.status == "0" ? "success" : "warning"} />
                  {record.status}
                </span>
            ),
        },
        {
            title: 'group',
            dataIndex: 'group',
            width: '10%',
            editable: true,
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
                <a
                  href="#"
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  {intl.formatMessage({id: "save"})}
                </a>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>{intl.formatMessage({id: "cancel"})}</a>
                </Popconfirm>
              </span>
            ) : (
                <Space>
                    {
                        record.key != "admin" ? (
                            <>
                                 <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    {intl.formatMessage({id: "edit"})}
                                </Typography.Link>
                                <Button onClick={() => showUpdatePasswordModal(true, record.key)}>{intl.formatMessage({id: "updatePassword"})}</Button>
                                 <Button type="primary" danger={record.status == '1' ? true : false } onClick={ () => banUser(record.key, record.status)}>
                                    {record.status == '0' ? intl.formatMessage({id: "ban"}) : intl.formatMessage({id: "deban"})}
                                </Button>
                                <Button type="primary" danger={true} onClick={ () => delUser(record.key)}>
                                    {intl.formatMessage({id: "delete"})}
                                </Button>
                            </>
                           
                        ) : null
                    }
                 
                </Space>
            );
          },
        },
      ];
      const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
    
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === 'group' ? 'select' : "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
            user_groups:  col.dataIndex === 'group' ? user_groups : [],
            onUserGroupChange
          }),
        };
      });

      return (
          <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                    body: {
                        cell: EditableCell,
                    },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                    onChange: cancel,
                    }}
                />
            </Form>
            <UpdatePasswordModal ref={ (el) => { updatePasswordModalRef.current = el} }/>
          </div>
        
      );
};

export default injectIntl(EditableTable)