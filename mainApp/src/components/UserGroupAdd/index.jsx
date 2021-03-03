import { Form, Checkbox, Input, Divider, Button, List, message } from 'antd';
import { useState, useEffect } from "react"
import { GetAllMenus } from "../../services/user"
import { addGroup } from "../../services/group"

const CheckboxGroup = Checkbox.Group;
import {AntdIconComponent} from "../helper/index"
import _ from "lodash"

const layout = {
    labelCol: {
      span: 4,
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

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
}

const UserGroupAddComponent = ({requireGroupName, initialCheckedList, onSubmit, updateItem}) => {

    const [form] = Form.useForm();
    const [datas, setDatas] = useState([])

    useEffect(() => {
        GetAllMenus((err, data) => {
            if (!err) {
                let tmp = [];
                data.map((item, idx) => {

                    let options = [];
                    let optionsIdMap = {}
                    let checkAll = true;
                    let checkedList = [];

                    item.c.map((c, index) => {
                        const desc = c.name + c.module
                        options.push(desc)
                        optionsIdMap[desc] = c.id

                        if (_.isArray(initialCheckedList)) {
                            if (initialCheckedList.indexOf(desc) == -1) {
                                checkAll = false
                            } else {
                                checkedList.push(desc)
                            }
                        }
                    })

                    tmp.push({
                        index: idx,
                        checkAll: _.isNull(initialCheckedList) ? true : checkAll,
                        indeterminate: _.isNull(initialCheckedList) ? true : checkAll,
                        checkedList: _.isNull(initialCheckedList) ? options : checkedList,

                        title: item.f.name + item.f.module,
                        id: item.f.id,
                        icon: item.f.icon,
                        optionsIdMap: optionsIdMap,
                        options: options
                    })
                })

                setDatas([...tmp])
            }
        })
    }, [])

    const onFinish = (values) => {
        const group_name = values.group_name;

        let tmp = [];
        datas.map((item, k) => {
            if (item.checkedList.length > 0) {
                tmp.push(item.id)

                for (let i = 0; i < item.checkedList.length; i++) {
                
                    if (_.isUndefined(item.optionsIdMap[item.checkedList[i]])) {
                        continue;
                    }

                    tmp.push(item.optionsIdMap[item.checkedList[i]])
                }
            }
        })

        values.models = tmp.join(",")

        if (_.isFunction(onSubmit)) {
            onSubmit(updateItem, values)
        } else {
            addGroup(group_name, values.models, (err, data) => {
                if (err) {
                    message.error(err)
                } else {
                    message.success("success")
                }
            })
        }
    }

    const onChange = (item, list) => {
       
        item.checkedList = list;
        item.indeterminate = !!list.length && list.length < item.options.length;
        item.checkAll = list.length === item.options.length;

        const newData = [...datas]
        newData[item.index] = item;
        
        setDatas([...newData])
    }

    const onCheckAllChange  = (e, item) => {
        item.checkedList = e.target.checked ? item.options : [];
        item.indeterminate = false
        item.checkAll = e.target.checked

        const newData = [...datas]
        newData[item.index] = item;

        setDatas([...newData])
    }

    return (
        <div>
            <Form className={formStyle} {...layout} form={form} name="user_group_add_form" onFinish={onFinish}>
                {
                    requireGroupName ?
                        (<Form.Item name="group_name" label="group_name" rules={[
                            {
                                required: true,
                            }
                            ]}>
                            <Input size={"middle"}/>
                        </Form.Item>) : null
                }
               
                <Form.Item name="models" label="">
                    <List
                        bordered={false}
                        itemLayout="horizontal" dataSource={datas}
                        renderItem={item => ( 
                            <List.Item>
                                <List.Item.Meta
                                    title={<Checkbox onChange={ (e) => onCheckAllChange(e, item)} indeterminate={item.indeterminate} checked={item.checkAll}>{item.title}</Checkbox>}
                                    description={<CheckboxGroup  onChange={ (list) => onChange(item, list) } options={item.options} value={item.checkedList}/>}
                                    avatar={<AntdIconComponent is={item.icon}/>} />
                            </List.Item>
                        )}
                     />
                </Form.Item>
                <Divider />
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default UserGroupAddComponent