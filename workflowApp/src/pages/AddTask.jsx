// import { FormattedMessage  } from 'react-intl'
import {addTask} from "../services/user"
import {useEffect, useState} from "react"
import { QuestionCircleOutlined, UploadOutlined  } from '@ant-design/icons';
import Select from "react-select"
import {
    Form,
    Input,
    Tooltip,
    Upload,
    Button,
    DatePicker, Space
} from 'antd';

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
        console.log("hjahha", values)
    }

    const onChangeEndTime = (value, dateString) => {
        console.log("onChangeEndTime", value, dateString)
    }

    const onEndTimeSetOk = (value) => {
        console.log("onEndTimeSetOk", value)
    }

    const priorityOptions = [
        {value: "1", label: "紧急"},
        {value: "2", label: "高"},
        {value: "3", label: "低"},
    ]

    const sendToOptions = [
        {value: "zjw", label: "郑金玮"},
        {value: "admin", label: "管理员"},
    ]


    return (
        <Form {...formItemLayout} style={formStyle} form={form} onFinish={onFormFinish}>
            <Form.Item
                name="task_name"
                label="任务名称"
                rules={[
                    {
                    required: true,
                    message: 'Please input your taskName!',
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
                    message: 'Please input your taskName!',
                    whitespace: true,
                    },
                ]}
                >
                <TextArea rows={8} />
            </Form.Item>
            <Form.Item
                initialValue={"4"}
                name="priority"
                label="优先级" rules={[{ required: true }]}
                >
                <Select
                    value={selectedPriorityOption} 
                    onChange={handlePriorityChange}
                    options={priorityOptions}
                    />
            </Form.Item>

            <Form.Item
                initialValue={"1"}
                label="派发给" rules={[{ required: true }]}
                name="sendto">
                   <Select
                    isMulti={true}
                    isSearchable={true}
                    value={selectedSendToOption} 
                    onChange={onSendToSelectChange}
                    options={sendToOptions}
                    />
            </Form.Item>
            <Form.Item name="end_datetime" label="截止日期" rules={[{ required: true }]}>
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
                <Upload name="files" action="/api/upload_task_files" listType="text" onChange={ () => {}}>
                    <Button icon={<UploadOutlined />}>upload</Button>
                </Upload>
            </Form.Item>
            

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default AddTask