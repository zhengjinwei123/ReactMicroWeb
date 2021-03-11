
import { Button, Tooltip } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import "./index.css"

const PRIORITY_TRANSLATE = {
    "danger": "紧急",
    "warn": "高",
    "normal": "低"
}

const TaskItem = (props) => {

    const handleDragStart = (e) => {
        props.onDragStart(props.id)
    }

    const onShowTaskDetailInfo = (taskid) => {
        console.log("onShowTaskDetailInfo", taskid)
    }
    
    let { id, title, priority, sender, active, onDragEnd } = props; 
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
                        <Button type="link" shape="circle" icon={<EyeTwoTone />} onClick={ (e) => {onShowTaskDetailInfo(id)}}/>
                    </Tooltip>

                    <Tooltip title="任务优先级">
                        <span className={"item-header-point " + priority}>
                            {PRIORITY_TRANSLATE[priority]}
                        </span>
                    </Tooltip>
                </span>
                {/* <span className={"item-header-point " + priority}>
                    <Tooltip title="任务优先级">
                        <Button type="dashed" shape="circle" icon={<EyeTwoTone />} /> {PRIORITY_TRANSLATE[priority]}
                    </Tooltip>
                   
                </span> */}
            </header>
            <main className="item-main">{title}</main>
        </div>
    )
}

export default TaskItem