import React, {useEffect, useState} from "react"
import RouterMap from "./routers/routerMap.jsx";
import configureStore, {persistor} from "./store/index.js";
import { Provider  } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';
import {GetServerRunInfo} from "./services/common"
import {IntlProvider} from "react-intl"

import {ConfigProvider} from "antd"
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import 'moment/locale/ja';
import 'moment/locale/vi';
import 'moment/locale/ko';


import enUS from 'antd/lib/locale/en_US'; // 英文
import zhCN from 'antd/lib/locale/zh_CN'; // 中文简体
import zhTW from "antd/lib/locale/zh_TW" // 中文繁体
import jaJP from "antd/lib/locale/ja_JP" // 日文
import koKR from "antd/lib/locale/ko_KR" // 韩文
import viVN from "antd/lib/locale/vi_VN" // 越南

import _ from "lodash"

const antLocaleMap = {
    "en": enUS, 
    "zh-cn": zhCN,
    "zh-tw": zhTW,
    "ja": jaJP,
    "ko": koKR,
    "vi": viVN
}

const defaultLanguage = "zh-cn"

// 默认中文显示 antd 组件描述
const AppFrameWork = (props) => {

    const {content, loading, language} = props

    const [lan, setLan] = useState(language || defaultLanguage)
    const [message, setMessage] = useState({})
  
    moment.locale(_.isUndefined(antLocaleMap[language]) ? defaultLanguage: language);

    useEffect(() => {
        GetServerRunInfo((err, data) => {
            if (!err) {
                setLan(data.lan)
                moment.locale(_.isUndefined(antLocaleMap[data.lan]) ? defaultLanguage: data.lan);

                try {
                    setMessage(JSON.parse(data.lanmsg))
                } catch(ex) {
                    console.error("load language error, invalid json format", ex)
                }
            }
        }) 
    }, [])


    return (
        <ConfigProvider locale={antLocaleMap[lan]}>
            <IntlProvider messages={message} locale={lan} defaultLocale="en">
                <Provider store={configureStore}>
                    <div id="zjw-loging-container"></div>
                    <PersistGate loading={null} persistor={persistor}>
                        <RouterMap loading={loading} content={content}/>
                    </PersistGate>
                </Provider>
            </IntlProvider>
        </ConfigProvider>
    )
}

export default AppFrameWork