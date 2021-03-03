const AntdIconComponent = ({is}) => {
    const Tag = require("@ant-design/icons")[is]

    if (!Tag) {
        return false
    }

    return <Tag />
}


export {
    AntdIconComponent
};