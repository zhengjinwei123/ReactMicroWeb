
import {useState} from "react"
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./index.css"

const STATUS_SAVED = "5"

const TaskCol = (props) => {

    const [inCol, setInCol] = useState(false)

    const handleDragEnter = (e) => {
        e.preventDefault();
        if (props.canDragIn) {
            setInCol(true)
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        if (props.canDragIn) {
            setInCol(false)
        }
    }

    const drag = () => {
        if (props) {
            try {
                props.dragTo(props.status)
                setInCol(false)
            } catch(e) {

            }
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()

        if (!props.canDragIn) {
            setInCol(false)
            return
        }
        if (props.status === STATUS_SAVED) {
            Modal.confirm({
                title: '确认',
                icon: <ExclamationCircleOutlined />,
                content: '确认归档此任务吗?归档后不可移动哦',
                okText: '确认',
                cancelText: '取消',
                onCancel: () => {
                    setInCol(false)
                },
                onOk: () => {
                    drag()
                    setInCol(false)
                }
              });

            // if (window.confirm("确认归档此任务吗?归档后不可移动哦")) {
            //     drag()
            // }
            // setInCol(false)
        } else {
            drag()
            setInCol(false)
        }
    }

    let { status, children } = props;
    return (
        <div 
            id={`col-${status}`} 
            className={'col'}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
            draggable={"true"}
        >
            <header className={"col-header " + "col-header-" + status}>
                {props.status_code[status]}
            </header>
            <main className={'col-main' + (inCol ? ' active' : '')}>
                {children}
            </main>
        </div>
    )
}

export default TaskCol