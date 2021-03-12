// import { FormattedMessage  } from 'react-intl'
import {getUsers} from "../services/task"
import { showLoading, hideLoading } from "../components/PageLoading"
import {useEffect, useState} from "react"
import { QuestionCircleOutlined, UploadOutlined  } from '@ant-design/icons';
import Select from "react-select"
import {
    Form,
    Input,
    Tooltip,
    Upload,
    Button,
    DatePicker, Space, message
} from 'antd';

import Axios from "axios"
import {getStorage} from "../utils/util"

const { TextArea } = Input;
const { RangePicker } = DatePicker;


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

const formStyle = {
    padding: "12px",
    background: "#fbfbfb",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: ' flex-start',
    maxWidth: 800,
}

const AddTask = (props) => {
    const [form] = Form.useForm();
    const [selectedPriorityOption, setSelectedPriorityOption] = useState(null)
    const [selectedSendToOption, setSelectedSendToOption] = useState(null)
    const [users, setUsers] = useState([])
    const [fileList, setFileList] = useState([])

    useEffect(() => {
        getUsers((err, data) => {
            if (err) {
                return
            }
            try {
                let obj = JSON.parse(data)

                let tmp = []
                obj.data.map((v, k) => {
                    tmp.push({
                        value: v.username,
                        label: v.nickname,
                    })
                })

                setUsers(tmp)
              
            } catch(e) {}
        
        })
    }, [])

    const onSendToSelectChange = (value) => {
        console.log(`selected ${value}`);
    }

    function handlePriorityChange(value) {
        console.log(`selected ${value}`);
    }

    const normFile = (e) => {
        console.log('Upload event:', e);
      
        if (Array.isArray(e)) {
          return e;
        }
      
        return e && e.fileList;
    };

    const onFormFinish = (values) => {
        showLoading();
        const formData = new FormData()
        fileList.forEach(file => {
            formData.append('files', file)
        });

        let taskName = values['task_name']
        let taskDesc = values['desc']
        let priority = values['priority'].value;
        let relaters = [];
        values['relaters'].forEach(item => {
            relaters.push(item.value)
        })
        let endDate = values['end_datetime'].format("YYYY-MM-DD HH:mm:ss")

        console.log(taskName, taskDesc, priority, relaters, endDate)

        formData.append('task_name', taskName)
        formData.append('task_desc', taskDesc)
        formData.append('priority', priority)
        formData.append('relaters', relaters)
        formData.append('end_date', endDate)
    

        let token = getStorage("token")
        let headerConfig = {
            headers:{
                "Content-Type": "multipart/form-data"
            }
        }

        if (!_.isEmpty(token)) {
            formData.append("token", token)
        }

        Axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
        Axios({
            method: 'post',
            url: 'upload/taskadd',
            data: formData,
            headerConfig
        }).then((data) => {
            console.log("upload resp:", data)

            data = data.data

            if (data.ret == undefined) {
                message.error("出错啦")
                return
            }
            if (data.ret != 0) {
                message.error(data.data)
                return
            }

            message.success("success")

            console.log("success", data)
        }).catch((err) =>{
            message.error(err)
            console.error("err", err)
        }).finally(() =>{
            hideLoading();
        })
    }

    const onChangeEndTime = (value, dateString) => {
        console.log("onChangeEndTime", value, dateString)
    }

    const onEndTimeSetOk = (value) => {
        console.log("onEndTimeSetOk", value)
    }

    const priorityOptions = [
        {value: "3", label: "紧急"},
        {value: "2", label: "高"},
        {value: "1", label: "低"},
    ]

    const uploadProps = {
        onRemove: file => {
            const index = fileList.indexOf(file)
            const newFileList = fileList.slice()
            newFileList.splice(index, 1)
            setFileList(newFileList)
        },
        beforeUpload: file => {
            fileList.push(file)
            setFileList([...fileList])
            return false
        },
        fileList,
        multiple: true,
    }

    const handleUpload = () => {
       

    }

    return (
        <Form {...formItemLayout} style={formStyle} form={form} onFinish={onFormFinish}>
            <Form.Item
                name="task_name"
                label="任务名称"
                rules={[
                    {
                    required: true,
                    message: '请输入任务名称!',
                    whitespace: true,
                    },
                ]}
                >
                <Input />
            </Form.Item>
            <Form.Item
                name="desc"
                label="任务描述"
                rules={[
                    {
                    required: true,
                    message: '请输入任务描述',
                    whitespace: true,
                    },
                ]}
                >
                <TextArea rows={8} />
            </Form.Item>
            <Form.Item
                name="priority"
                label="优先级"  rules={[{ required: true, 
                    message: '请选择任务优先级',
                     }]}
                >
                <Select
                    value={selectedPriorityOption} 
                    onChange={handlePriorityChange}
                    options={priorityOptions}
                    />
            </Form.Item>

            <Form.Item
                label="派发给" rules={[{ required: true, 
                message: '请选择任务派发对象!',
                }]}
                name="relaters">
                   <Select
                    isMulti={true}
                    isSearchable={true}
                    value={selectedSendToOption} 
                    onChange={onSendToSelectChange}
                    options={users}
                    />
            </Form.Item>
            <Form.Item name="end_datetime" label="截止日期" rules={[{ required: true,message: "请设定一个任务截止时间" }]}>
                <DatePicker showTime onChange={onChangeEndTime} onOk={onEndTimeSetOk} />
            </Form.Item>
           

            <Form.Item
                valuePropName="fileList"
                getValueFromEvent={normFile}
                name="files"
                label={
                    <span>
                   附件&nbsp;
                    <Tooltip title="附件?">
                        <QuestionCircleOutlined />
                    </Tooltip>
                    </span>
                }
                >
                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>选择附件</Button>
                </Upload>
            </Form.Item>
            
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                提交
                </Button>
            </Form.Item>
        </Form>
    )
}

export default AddTask