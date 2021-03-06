import React from 'react';
import 'antd/dist/antd.css';
import {Select} from 'antd';

const {Option} = Select;


export default class ExpiryDateDropdown extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let expiryDates = this.props.expiryDates;

        return (
            <>
                <Select defaultValue={expiryDates[2]} style={{width: 120}} getPopupContainer={trigger => trigger.parentNode}>
                    {expiryDates.map((date, i) => <Option value={date}>{date}</Option>)}
                </Select>
            </>
        )
    }
}