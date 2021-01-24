import React from "react";
import 'antd/dist/antd.css'
import {SaveOutlined} from "@ant-design/icons";
import './GridHeader.css'

export default class GridHeader extends React.Component {

    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        let state = this.props.getColumnState();
        const httpRequest = new XMLHttpRequest();
        httpRequest.open(
            'POST',
            'http://127.0.0.1:5000/api/v1/columns-state/',
        );
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(state));

    }

    render() {
        return (
            <div className={"grid-header"}>
                <h3 className="ant-typography title">Market overview</h3>
                <div className="actions">
                    <button type="button" onClick={this.handleOnClick}
                            className="ant-btn ant-btn-link actions">
                                <span role="img"
                                      aria-label="cloud-upload"
                                      className="anticon anticon-cloud-upload">
                                    <SaveOutlined/>
                                    <svg viewBox="64 64 896 896" focusable="false"
                                         width="1em" height="1em" fill="currentColor"
                                         aria-hidden="true"/>
                                </span>
                        <span>Save view</span>
                    </button>
                </div>
            </div>
        )
    }

}