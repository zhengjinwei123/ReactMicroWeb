import { Tabs} from 'antd';
import { UserAddOutlined, UsergroupAddOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from "react"
import _ from "lodash"
import {getAllGroups } from "../../services/group"
import {injectIntl} from 'react-intl'

const { TabPane } = Tabs;

import RegistrationForm from "../../components/RegisterUser/index"
import UserManagerComponent from "../../components/UserMgr/index"
import UserGroupAddComponent from "../../components/UserGroupAdd/index"
import UserGroupManager from "../../components/UserGroupMgr/index"

export default injectIntl(({intl}) => {

    const [userGroups, setUserGroups] = useState([])
    const [activekey, setActivekey] = useState(1)
    const userGroupMgrCompRef = useRef(null)

    const onChange = (activeKey) => {
        setActivekey(activeKey)
    }

    useEffect(() => {

        if (activekey == 1 || activekey == 2) {
            getAllGroups((err, data) => {
                if (!err) {
                    const tmp = data
                    setUserGroups([...tmp])
                }
            })
        }

        if (activekey == 4 && userGroupMgrCompRef.current) {
            userGroupMgrCompRef.current.loadAllGroups();
        }
       
    }, [activekey, userGroupMgrCompRef])

    return (
        <div>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <TabPane
                    tab={
                        <span>
                        <UserAddOutlined />
                        {intl.formatMessage({id: "addUser"})}
                        </span>
                    }
                    key="1"
                >
                <RegistrationForm user_groups={userGroups}/>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                        <UserOutlined />
                        {intl.formatMessage({id: "userManager"})}
                        </span>
                    }
                    key="2"
                >
                <UserManagerComponent user_groups={userGroups}/>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        <UsergroupAddOutlined />
                        {intl.formatMessage({id: "addUserGroup"})}
                        </span>
                    }
                    key="3"
                >
                <UserGroupAddComponent onFinish={null} initialCheckedList={[]} requireGroupName={true} />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        <UserSwitchOutlined />
                        {intl.formatMessage({id: "userGroupManager"})}
                        </span>
                    }
                    key="4"
                >
               <UserGroupManager ref={ (el) => {userGroupMgrCompRef.current = el} }/>
                </TabPane>
            </Tabs>
        </div>
    )
})