import React from "react";
import 'antd/dist/antd.css'
import {SaveOutlined} from "@ant-design/icons";
import './GridHeader.css'
import {LocalStorageWrapper} from "../LocalStorageWrapper";
import Watchlists from "./Watchlists";

export default class GridHeader extends React.Component {

    constructor(props) {
        super(props);

        let local = new LocalStorageWrapper();
        this.state = {
            watchlist: local.getCurrentWatchlist(),
        }
        this.handleOnSaveViewClick = this.handleOnSaveViewClick.bind(this);
    }

    getCurrentWatchlist = (currentWatchlist) => {
        this.setState({watchlist: currentWatchlist});
    }

    handleOnSaveViewClick() {
        let state = this.props.getColumnState();
        const httpRequest = new XMLHttpRequest();
        httpRequest.open(
            'POST',
            process.env.REACT_APP_BACKEND + 'columns-state/',
        );
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(state));
    }


    render() {
        const currentWatchlist = this.state.watchlist;

        return (
            <div className={"grid-header"}>
                <h3 className="ant-typography title">Market overview</h3>
                <h5 style={{fontStyle: 'italic', display: 'inline-block'}}>{currentWatchlist}</h5>
                <div className="actions">
                    <button type="button" onClick={this.handleOnSaveViewClick}
                            className="ant-btn ant-btn-link actions" style={{fontSize: '1.5em'}}>
                                <span role="img"
                                      aria-label="cloud-upload"
                                      className="anticon anticon-cloud-upload">
                                    <SaveOutlined/>
                                    Save view
                                </span>
                    </button>
                    <Watchlists getCurrentWatchlist={this.getCurrentWatchlist}/>
                </div>
            </div>
        )
    }
}