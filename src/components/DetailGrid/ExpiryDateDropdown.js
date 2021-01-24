import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import React from 'react';
import './DetailGrid.css'
import {Select} from 'antd';

const {Option} = Select;

export default class ExpiryDateDropdown extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let expiryDates = this.props.expiryDates;
        if(expiryDates !=null){
            console.log(expiryDates.length)
        }
        return (
            <>
                <Select defaultValue={expiryDates[1]} style={{width: 120}} bordered={false}>
                    {expiryDates.map((date, i) => <Option value={date}>{date}</Option>)}
                </Select>
            </>
        )
    }
}