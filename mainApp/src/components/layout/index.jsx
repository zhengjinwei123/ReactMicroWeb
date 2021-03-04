import React, {useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Layout, PageHeader, Tag, Dropdown , Popover, Menu, BackTop, Avatar, Button, Breadcrumb} from 'antd';
import {AntdIconComponent} from "../helper/index.jsx"
import { LoadingComponent } from "../PageLoading"
import { Helmet } from "react-helmet"
import { logout, setUserLogout, checkUserHasLogin } from "../../services/user"
import { redirectLogin, redirectTo } from "../../utils/util"
import _ from "lodash"
import { FormattedMessage  } from 'react-intl'

import {GetLoginUserInfo} from "../../services/user"
import UpdatePasswordModal from "../UpdatePasswordModal/index"



// import "./index.css"

const { Header, Content, Sider, Footer } = Layout;
const { SubMenu } = Menu

const headerStyle = {
    position: 'fixed',
    height: 80,
    zIndex: 1,
    width: '100%',
    color: 'red',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderBottom: "1px solid #E3E3E3",
    boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
    background: "url('/img/logo.png') #FFF no-repeat 16px 16px"
}

const siderStyle = {
    background: '#f5f5f5',
    left: 0,
    marginLeft: 2,
    marginTop: 100,
    boxShadow: '0 1px 10px rgba(0,0,0,0.8)',
    borderRadius: '4px'
}

const siderContentLayoutStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
}

const childrenStyle = {
    paddingLeft: "20px",
    paddingTop: "20px",
    paddingRight: "20px",
    display: "flex",
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
}

const contentStyle = {
    color: 'red',
    overFlow: 'scroll',
    marginLeft: 1,
    marginTop: 100,
    background: '#fefefe',
    paddingLeft: 30,
}

const backupStyle = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
}

const footerStyle = {
    textAlign: 'center',
    fontSize: 20,
}

const MyLayout = (props) => {

    if (!checkUserHasLogin()) {
        redirectLogin()
        return;
    }

    const [menus, setMenus] = useState(props.userinfo.menus)
    const [collapsed, setCollapsed] = useState(false)
    const [defaultSelectMenuKey, setDefaultSelectMenuKey] = useState(menus && menus.length ? menus[0].f.id : 0)
    const updatePasswordModalRef = useRef(null)

    const userHasPageAuth = (menus) => {
        const pathName =  window.location.pathname

        if (pathName === "/" || pathName === "/dashboard") {
            return true;
        }

        if (_.isArray(menus) && menus.length) {
            for (let i = 0; i < menus.length; ++i) {
                const c = menus[i].c
                for (let j = 0; j < c.length; ++j) {
                    const m = c[j]
                    if (m.module === pathName) {
                        return true;
                    }
                }
            }
        }

        return false
    }

    if (!userHasPageAuth(menus)) {
        redirectTo("/dashboard")
        return;
    }
    //请求菜单
    useEffect(() => {
        if (!_.isArray(menus)) {
            GetLoginUserInfo((err, data) => {
                if (!err) {

                    props.userinfoActions.login({
                        username: props.userinfo.username,
                        menus: data.menus,
                        webname: data.webname,
                        timezone: data.timezone
                    })

                    setMenus(data.menus)

                    setDefaultSelectMenuKey(data && data.length ? data[0].f.id : 0)
                }
            })
        }
    }, [])


    const handleLogout = (e) => {
        e.preventDefault();

        logout( (err, data) => {
            setUserLogout()
            props.userinfoActions.logout();
        })
    }

    const updatePassword = (e) => {
        e.preventDefault();

        if (updatePasswordModalRef.current) {
            updatePasswordModalRef.current.showUpdatePasswordModal(true, props.userinfo.username)
        }
    }

    const siderCollapseEvent = (collapsed, type) => {
        setCollapsed(collapsed)
    }

    const titleNode = (
        <h2>{props.userinfo.webname}</h2>
    )
    const subTitleNode = (
        <h4><Tag color="geekblue">当前时区: {props.userinfo.timezone} <FormattedMessage id="hello"/></Tag></h4>
    )
    const userDropDownNode = () => {
        return (
            <Menu>
                <Menu.Item><a href="@" onClick={handleLogout}>登出</a></Menu.Item>
                <Menu.Item><a  href="@" onClick={updatePassword}>修改密碼</a></Menu.Item>
            </Menu>
        )
    }

    const onClickMenu = (e, module, fModule) => {
        e.preventDefault();
        window.history.replaceState({
            links: [fModule.name, module.name]
        }, module.module, module.module)
        // window.history.pushState({}, moduleName, moduleName);
        // window.location.href = moduleName;
    }
    const links = window.history.state == null ? [] : (window.history.state.links || []);

    let menuNode = (
        <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={[defaultSelectMenuKey]}
            mode="inline"
            theme="light">
            {
                _.isArray(menus) ? menus.map((val ,k) => {
                    return (
                        <SubMenu key={k} icon={<AntdIconComponent is={val.f.icon}/>} title={val.f.name}>
                            {
                                val.c.map((c, k1) => {
                                    return (<Menu.Item key={k1} icon={<AntdIconComponent is={c.icon}/>} >
                                        <Button type="link" onClick={(e) => onClickMenu(e, c, val.f) }>{c.name}</Button>
                                    </Menu.Item>)
                                })
                            }
                        </SubMenu>
                    )
                }) : null
            }
        </Menu>
    )

    return (
        <>
             <Helmet>
                <meta charSet="utf-8" />
                <title>{props.userinfo.webname}</title>
                <meta name="description" content={props.userinfo.webname}/>
            </Helmet>
            <Layout>           
                <Header style={headerStyle}>
                    <div className="header-inner">
                        <div className="header-left">
                            <PageHeader backIcon={false}
                                onBack={() => null}
                                title={titleNode}
                                subTitle={subTitleNode}
                            />
                            <div>{collapsed}</div>
                        </div>
                        <div className="header-right">
                            <Dropdown overlay={userDropDownNode}>
                                <Popover placement="leftTop" content={"当前用户:" + props.userinfo.username}>
                                    <a href="##">
                                        <Avatar
                                            style={{
                                                    backgroundColor: '#1890ff'
                                            }}
                                            icon={<AntdIconComponent is="UserOutlined" />}
                                        />
                                    </a>
                                </Popover>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                <Layout style={siderContentLayoutStyle}>
                    <Sider style={siderStyle} collapsible={true} width={250} onCollapse={siderCollapseEvent} >
                        {menuNode}
                    </Sider>
                    <Content style={contentStyle}>
                        <Tag color="magenta">
                            <Breadcrumb separator="/">
                                <Breadcrumb.Item href="/dashboard"> <AntdIconComponent is="HomeOutlined" /></Breadcrumb.Item>
                                {
                                    links.map((val, k) => {
                                        return (
                                            <Breadcrumb.Item key={k}>{val}</Breadcrumb.Item>
                                        )
                                    })
                                }
                            </Breadcrumb>
                        </Tag>
                        <div style={childrenStyle}>
                            {
                                props.loading ? <LoadingComponent /> : null
                            }
                            {
                                props.content ?  <div dangerouslySetInnerHTML={{ __html: props.content }} /> :  props.children
                            }
                            <BackTop>
                                <div style={backupStyle}>UP</div>
                            </BackTop>
                        </div>
                    </Content>
                </Layout>
                
                <Footer style={footerStyle}>
                        {props.userinfo.webname}
                        <a href="/#">www.baidu.com</a>
                </Footer>
                <UpdatePasswordModal ref={(el) => { updatePasswordModalRef.current = el }}/>
                <style jsx>{`
                    .header-inner {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 100%;
                    }
                    .header-left {
                        display: flex;
                        width: 90%;
                        height: 100%;
                    }

                    .header-right {
                        display: flex;
                        width: 60px;
                        height: 100%;
                        margin-right: 10px;
                        margin-left: 20px;
                    }
                `}</style>
            </Layout>
        </>
    )
}


export default withRouter(MyLayout);
