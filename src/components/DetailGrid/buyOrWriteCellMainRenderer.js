import React, {Component} from 'react';
import {DownOutlined} from '@ant-design/icons';


export default class buyOrWriteCellMainRenderer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a target="_blank" rel="noopener noreferrer">
                {this.props.value}
                <DownOutlined style={{float:"right", alignItems:"center", marginTop:'15%'}}/>
            </a>
        )
    }
}