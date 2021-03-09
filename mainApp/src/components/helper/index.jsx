import { FormattedMessage} from 'react-intl'

const AntdIconComponent = ({is}) => {
    const Tag = require("@ant-design/icons")[is]

    if (!Tag) {
        return false
    }

    return <Tag />
}

const Translate = ({id}) => {
    return <FormattedMessage id={id} defaultMessage={id}/>
}


export {
    AntdIconComponent,
    Translate,
};