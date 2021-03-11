
import {useState} from "react"
import {Modal} from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./index.css"

const STATUS_SAVED = "saved"

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
            console.log("hahaha")
            try {
                props.dragTo(props.status)
                setInCol(false)
                console.log("hahahaaaaaaaaaaaa")
            } catch(e) {}
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()

        if (props.status === STATUS_SAVED) {
            Modal.confirm({
                title: '归档确认',
                icon: <ExclamationCircleOutlined />,
                content: '确认归档此任务吗?归档后不可移动哦',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    drag()
                }
            });
        } else {
            drag()
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
            draggable="true"
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