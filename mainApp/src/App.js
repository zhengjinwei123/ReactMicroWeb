import React, {useEffect, useState} from "react"
import RouterMap from "./routers/routerMap.jsx";
import configureStore, {persistor} from "./store/index.js";
import { Provider  } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';
import {GetServerRunInfo} from "./services/common"
import {IntlProvider} from "react-intl"
import _ from "lodash"
import {ConfigProvider} from "antd"
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import 'moment/locale/ja';
import 'moment/locale/vi';
import 'moment/locale/ko';

import zh_CN from 'antd/lib/locale/zh_CN'; // 中文简体
import en_US from 'antd/lib/locale/en_US'; // 英文
import zh_TW from 'antd/lib/locale/zh_TW'; // 繁体
import ja_JP from 'antd/lib/locale/ja_JP'; // 日文
import ko_KR from 'antd/lib/locale/ko_KR'; // 韩文
import vi_VN from 'antd/lib/locale/vi_VN'; // 越南

const defaultLanguage = "zh-cn"
const antdLanMap = {
    "en": en_US, 
    "zh-cn": zh_CN,
    "zh-tw": zh_TW,
    "ja": ja_JP,
    "ko": ko_KR,
    "vi": vi_VN
}

const LoadLocalLocale = (lan) => {
    if (_.isUndefined(antdLanMap[lan])) {
        lan = defaultLanguage;
    }
    const LAN = require("./locales/" + lan + ".json")
    return LAN;
}

// 默认中文显示 antd 组件描述
const AppFrameWork = (props) => {

    const {content, loading, language} = props

    const [lan, setLan] = useState(language || defaultLanguage)
    moment.locale(_.isUndefined(antdLanMap[lan]) ? defaultLanguage: lan);

    useEffect(() => {
        GetServerRunInfo((err, data) => {
            if (!err) {
                setLan(data.lan)
                moment.locale(_.isUndefined(antdLanMap[data.lan]) ? defaultLanguage: data.lan);
            }
        }) 
    }, [])

    return (
        <ConfigProvider locale={antdLanMap[lan]}>
            <IntlProvider messages={LoadLocalLocale(lan)} locale={lan} defaultLocale="en">
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