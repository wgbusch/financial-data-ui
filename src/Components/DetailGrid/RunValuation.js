import {Button} from 'antd';
import {CaretRightOutlined} from '@ant-design/icons';
import React from 'react';
import './DetailGrid.css'

export default class RunValuation extends React.Component {
    state = {
        size: 'large',
    };

    render() {
        const {size} = 2;
        return (
            <>
                <Button type="primary" icon={<CaretRightOutlined />} size={size} style={{margin: '5px'}}/>
            </>
        );
    }
}