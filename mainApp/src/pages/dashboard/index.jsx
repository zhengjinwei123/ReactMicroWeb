import {
    DatePicker,
    TimePicker
} from 'antd';

const { RangePicker } = DatePicker;


const DashBorad = () => {

    return (
        <div>
            <DatePicker />
            <TimePicker />
            <RangePicker style={{ width: 200 }} />
        </div>
    )
}

export default DashBorad