import {useState, useEffect} from "react"
import TaskCol from "../../components/TaskCol/index.jsx"
import TaskItem from "../../components/TaskItem/index.jsx"
import {getMyTaskList, updateStatus} from "../../services/task"

import { message } from 'antd';

import "./index.css"

const STATUS_SAVED = 5

const STATUS_CODE = {
    0: '待处理',
    1: '进行中',
    2: '研发完成',
    3: '验收中',
    4: "验收完成",
    5: "归档"
}

const PRIORITY_CODE = {
    3: "danger",
    2: "warn",
    1: "normal",
    0: "normal"
}

//任务状态 0:待处理 1：进行中 2：完成 3：测试中  4：验收完毕

const MyTask = (props) => {

    const [tasks, setTasks] = useState([])
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        getMyTaskList((err, data) => {
            console.log("akkkk", err, data)

            if (err) {
                return;
            }
            data.map((item, k) => {
                tasks.push({
                    id: k,
                    item: item,
                    status: item.status,
                    title: "[" +item.taskName + "]\r\n" + item.taskDesc,
                    sender: item.promoter,
                    priority: PRIORITY_CODE[item.priority],
                    updateAt: item.modify_time,
                })
            })

            setTasks([...tasks])
        })
    }, [])


    const onDragStart = (id) => {

        if (tasks[id] && tasks[id].status == STATUS_SAVED) {
            message.error('归档的任务不能移动!!!');
        } else {
            setActiveId(id)
        }
    }

    const dragTo = (status) => {
        let task = tasks[activeId];

        if (task.status == status) {
            cancelSelect();
            return
        }

        updateStatus(task.task_id, parseInt(status), (err, data) => {
           
            cancelSelect();
            if (err) {
                return;
            }
            task.status = status;
            setTasks([...tasks])
        });
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
                        canDragIn={activeId != null && tasks[activeId] && tasks[activeId].status !== status && tasks[activeId].status != STATUS_SAVED}>
                        { tasks.filter(t => t.status == status).map(t => 
                            <TaskItem
                                item={t.item}
                                key={t.id}
                                active={t.id == activeId}
                                id={t.id}
                                title={t.title} 
                                priority={t.priority} 
                                sender={t.sender}
                                updateAt={t.updateAt}
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