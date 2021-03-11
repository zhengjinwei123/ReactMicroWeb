import {useState} from "react"
import TaskCol from "../../components/TaskCol/index.jsx"
import TaskItem from "../../components/TaskItem/index.jsx"

import { message } from 'antd';


import "./index.css"

const STATUS_TODO = 'todo';
const STATUS_SAVED = "saved"

const STATUS_CODE = {
    todo: '待处理',
    doing: '进行中',
    done: '已完成',
    saved: '已归档'
}

const taskList = [{
    id: 0,
    status: STATUS_TODO,
    title: '每周七天阅读五次，每次阅读完要做100字的读书笔记每周七天阅读五次，每次阅读完要做100字的读书笔记',
    sender: '小夏',
    priority: "danger"
}, {
    id: 1,
    status: STATUS_TODO,
    title: '每周七天健身4次，每次健身时间需要大于20分钟',
    sender: '橘子🍊',
    priority: "warn"
}, {
    id: 2,
    status: STATUS_TODO,
    title: '每周七天健身4次，每次健身时间需要大于20分钟',
    sender: 'aaaa',
    priority: "normal"
}]

const MyTask = (props) => {

    const [tasks, setTasks] = useState(taskList)
    const [activeId, setActiveId] = useState(null)

    const onDragStart = (id) => {

        if (tasks[id] && tasks[id].status === STATUS_SAVED) {
            console.log(tasks[id])
            message.error('归档的任务不能移动!!!');
        } else {
            setActiveId(id)
        }
    }

    const dragTo = (status) => {
        let task = tasks[activeId];
        if (task.status !== status) {
            task.status = status;
            setTasks(tasks)
        }
        cancelSelect();
    }
    
    const cancelSelect = () => {
        setActiveId(null)
    }

    return (
        <div className="task-wrapper">
            {
                Object.keys(STATUS_CODE).map(status => 
                    <TaskCol 
                        status_code={STATUS_CODE}
                        status={status} 
                        key={status} 
                        dragTo={dragTo}
                        canDragIn={activeId != null && tasks[activeId] && tasks[activeId].status !== status}>
                        { tasks.filter(t => t.status === status).map(t => 
                            <TaskItem
                                key={t.id}
                                active={t.id === activeId}
                                id={t.id}
                                title={t.title} 
                                priority={t.priority} 
                                sender={t.sender}
                                onDragStart={onDragStart}
                                onDragEnd={cancelSelect}
                            />)
                        }
                    </TaskCol>
                )
            }
        </div>
    )
}

export default MyTask