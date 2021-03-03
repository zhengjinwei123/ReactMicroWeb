import { Tabs, Table, Button, Space, Modal } from 'antd';
import { UserAddOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import _ from "lodash"
import { updateGroupMenus,getAllGroups, deleteGroup } from "../../services/group"

const { TabPane } = Tabs;

import RegistrationForm from "../../components/RegisterUser/index"
import UserManagerComponent from "../../components/UserMgr/index"
import UserGroupAddComponent from "../../components/UserGroupAdd/index"


const UserGroupManager = forwardRef((props, ref) => {

    const [datas, setDatas] = useState([])
    const [dataChanged, setDataChanged] = useState(false)

    const onModelChange = (updateItem, values) => {
        Modal.confirm({
            title: '修改用户组?',
            icon: <ExclamationCircleOutlined />,
            content: '确认修改吗',
            onOk: () => {
                updateGroupMenus(updateItem.group_id, values.models, (err, data) => {
                  if (err) {
                    Modal.error({
                        title: "错误",
                        content: err
                    });
                  } else {
                    setDataChanged(!dataChanged)
                  }
              })
            },
            onCancel: () => {
                handleCancel(updateItem)
            },
        });
    }

    const loadAllGroups = () => {
        getAllGroups((err, data) => {
            if (!err) {
                let tmp = [];
                data.map((item, idx) => {
                    let options = [];
                    const models = item.menus;

                    for (let i = 0; i < models.length; i++) {

                        const m = models[i]
                        for (let j = 0 ; j < m.c.length; j++) {
                            const desc1 = m.c[j].name + m.c[j].module
                            options.push(desc1)
                        }
                    }
                    tmp.push({
                        group_id: item.group_id,
                        group_name: item.group_name,
                        key: idx,
                        expandable: false, 
                        isEditing: false,
                        initialCheckedList: options,
                    })
                })

                setDatas(tmp)
            }
        })
    }

    useImperativeHandle(ref, () => ({
        loadAllGroups
    }));

    useEffect(() => {
        loadAllGroups()
    }, [dataChanged])


    const handleEdit = (record) => {

        if (!record.isEditing) {
            const tmp = [...datas]
            tmp[record.key].isEditing = true;
            tmp[record.key].expandable = true;

            setDatas(tmp)
        }
    }
    
    const handleCancel = (record) => {
        if (record.isEditing) {
            const tmp = [...datas]
            tmp[record.key].isEditing = false;
            tmp[record.key].expandable = false;
            setDatas(tmp)
        }
    }

    const handleDelete = (record) => {
        Modal.confirm({
            title: '删除用户组?',
            icon: <ExclamationCircleOutlined />,
            content: '删除用户组后，已经拥有用户组权限的用户将无法重新登录，确认删除吗?',
            onOk: () => {
                deleteGroup(record.group_id, (err, data) => {
                  if (err) {
                    Modal.error({
                        title: "错误",
                        content: err
                    });
                  } else {
                    setDataChanged(!dataChanged)
                  }
              })
            },
            onCancel: () => {

            },
        });
    }

    const columns = [
        { title: 'group_id', dataIndex: 'group_id', key: 'group_id' },
        { title: 'group_name', dataIndex: 'group_name', key: 'group_name' },
        {
          title: 'operation',
          dataIndex: '',
          key: 'operation',
          render: (record) => <Space>
              {
                  record.group_id != 1 ? (
                    !record.isEditing ? (
                        <Button type="link" onClick={ (e) => handleEdit(record)}>Edit</Button>
                      ) :  <Button type="link" onClick={ (e) => handleCancel(record)}>Cancel</Button>
                  ) : null
              }

            <Button type="primary" disabled={record.group_id == 1} danger={true} onClick={ (e) => handleDelete(record)}>Delete</Button>
          </Space>
        },
    ];

    // expandIconAsCell={false}
    // expandedRowKeys={[]}
    return (
        <Table
            columns={columns}
            expandable={{
                expandIconColumnIndex: false,
                defaultExpandAllRows: true,
                defaultExpandedRowKeys: [],
                expandedRowRender: record => <UserGroupAddComponent 
                    updateItem={record}
                    onSubmit={ (updateItem, values) => onModelChange(updateItem, values)}
                    initialCheckedList={record.initialCheckedList}
                    requireGroupName={false}
                />,
                rowExpandable: record => record.expandable,
            }}
            dataSource={datas}
        />
    )
})

export default () => {

    const [userGroups, setUserGroups] = useState([])
    const [activekey, setActivekey] = useState(1)
    const userGroupMgrCompRef = useRef(null)

    const onChange = (activeKey) => {
        setActivekey(activeKey)
    }

    useEffect(() => {

        if (activekey == 1 || activekey == 2) {
            getAllGroups((err, data) => {

                console.log("ahahaha", data)
                if (!err) {
                    const tmp = data
                    setUserGroups([...tmp])
                }
            })
        }

        if (activekey == 4 && userGroupMgrCompRef.current) {
            userGroupMgrCompRef.current.loadAllGroups();
        }
       
    }, [activekey, userGroupMgrCompRef])

    return (
        <div>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <TabPane
                    tab={
                        <span>
                        <UserAddOutlined />
                        添加用户
                        </span>
                    }
                    key="1"
                >
                <RegistrationForm user_groups={userGroups}/>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                        <UserOutlined />
                        用户管理
                        </span>
                    }
                    key="2"
                >
                <UserManagerComponent user_groups={userGroups}/>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        <UsergroupAddOutlined />
                        添加用户组
                        </span>
                    }
                    key="3"
                >
                <UserGroupAddComponent onFinish={null} initialCheckedList={[]} requireGroupName={true} />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        <UserSwitchOutlined />
                        用户组管理
                        </span>
                    }
                    key="4"
                >
               <UserGroupManager ref={ (el) => {userGroupMgrCompRef.current = el} }/>
                </TabPane>
            </Tabs>
        </div>
    )
}