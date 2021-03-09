import { Table, Button, Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react"
import _ from "lodash"
import { updateGroupMenus,getAllGroups, deleteGroup } from "../../services/group"
import {injectIntl} from 'react-intl'

import UserGroupAddComponent from "../../components/UserGroupAdd/index"

const UserGroupManager = (props) => {

    const {intl} = props

    const [datas, setDatas] = useState([])
    const [dataChanged, setDataChanged] = useState(false)

    const onModelChange = (updateItem, values) => {
        Modal.confirm({
            title: intl.formatMessage({id: "updateUserGroup"}),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({id: "confirmUpdate"}),
            onOk: () => {
                updateGroupMenus(updateItem.group_id, values.models, (err, data) => {
                  if (err) {
                    Modal.error({
                        title: intl.formatMessage({id: "error"}),
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

    const processData = (datas) => {
        let tmp = [];
        console.log("load zjw11222")
        datas.map((item, idx) => {
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

        console.log("load zjw11555")
        setDatas(tmp)
    }

    const loadAllGroups = () => {
        getAllGroups((err, data) => {
            if (!err) {
                processData(data)
            }
        })
    }

    useEffect(() => {
        loadAllGroups()
    }, [dataChanged, props.changed])


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
            title:  intl.formatMessage({id: "delUserGroup"}),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({id: "delUserGroupWarn"}),
            onOk: () => {
                deleteGroup(record.group_id, (err, data) => {
                  if (err) {
                    Modal.error({
                        title: intl.formatMessage({id: "error"}),
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
                        <Button type="link" onClick={ (e) => handleEdit(record)}>{ intl.formatMessage({id: "edit"})}</Button>
                      ) :  <Button type="link" onClick={ (e) => handleCancel(record)}> {intl.formatMessage({id: "cancel"})}</Button>
                  ) : null
              }

            <Button type="primary" disabled={record.group_id == 1} danger={true} onClick={ (e) => handleDelete(record)}> {intl.formatMessage({id: "delete"})}</Button>
          </Space>
        },
    ];
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
}

export default injectIntl(UserGroupManager)