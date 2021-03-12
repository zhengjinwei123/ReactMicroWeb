
import { Button, Tooltip, Modal  } from 'antd';
import {useState} from "react"
import { EyeTwoTone } from '@ant-design/icons';
import "./index.css"

const PRIORITY_TRANSLATE = {
    "danger": "紧急",
    "warn": "高",
    "normal": "低"
}

const TaskItem = (props) => {

    const [visibleTaskInfoDialog, setVisibleTaskInfoDialog] = useState(false)

    const handleDragStart = (e) => {
        props.onDragStart(props.id)
    }

    const onShowTaskDetailInfo = () => {
        console.log("onShowTaskDetailInfo", props.item)

        setVisibleTaskInfoDialog(true)
    }

    const onUpdateTask = () => {
        console.log("ppp", props.item)
    }
    
    let { id, title, priority, sender, active, onDragEnd, updateAt } = props; 
    return (
        <div 
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            id={`item-${id}`} 
            className={'item' + (active ? ' active' : '')}
            draggable="true"
        >
            <header className="item-header">
                 <span className="item-header-username">{sender}</span>
             
                 <span className="item-header-look">
                     <Tooltip title="点击查看详情">
                         <Button size={"large"} type="link" shape="circle" icon={<EyeTwoTone />} onClick={ (e) => {onShowTaskDetailInfo()}}/>
                     </Tooltip>

                     <Tooltip title="任务优先级">
                         <span className={"item-header-point " + priority}>
                             {PRIORITY_TRANSLATE[priority]}
                         </span>
                     </Tooltip>
                 </span>
             </header>

            <main className="item-main">{title}</main>
            <footer className="item-footer">更新时间: {updateAt}</footer>

            <Modal
                title="任务详情"
                style={{ top: 20 }}
                visible={visibleTaskInfoDialog}
                onOk={() => onUpdateTask(task_id)}
                onCancel={() => setVisibleTaskInfoDialog(false)}
                >
                <p>some contents...</p>
                <p>some contents...</p>
                <p>some contents...</p>
            </Modal>
        </div>
    )
}

export default TaskItem