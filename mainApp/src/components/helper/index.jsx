

const AntdIconComponent = ({is}) => {
    const Tag = require("@ant-design/icons")[is]

    if (!Tag) {
        return false
    }

    return <Tag />
}

const AntdLanguageLoad = (lan, defaultLanguage = "zh-cn") => {
    const localeMap = {
        "en": 1, 
        "zh-cn": 1,
        "zh-tw": 1,
        "ja": 1,
        "ko": 1,
        "vi": 1
    }

    let language = localeMap[lan] ?  lan : defaultLanguage
}

// 加载本地语言包
const LoadLocalLocale = (language) => {
 
}

export {
    AntdIconComponent,
    LoadLocalLocale
};