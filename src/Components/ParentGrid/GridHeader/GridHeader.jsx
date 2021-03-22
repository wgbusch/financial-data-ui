import React from "react";
import 'antd/dist/antd.css'
import {SaveOutlined} from "@ant-design/icons";
import './GridHeader.css'
import Watchlists from "./Watchlists";
import SearchTickerAutocomplete from "./SearchTickerAutocomplete";


export default class GridHeader extends React.Component {

    constructor({saveColumnsState, handleSelectWatchlist, addTickerToWatchlist, ...props}) {
        super({saveColumnsState, handleSelectWatchlist, addTickerToWatchlist, ...props});
        this.saveColumnsState = saveColumnsState.bind(this);
        this.handleSelectWatchlist = handleSelectWatchlist.bind(this);
        this.addTickerToWatchlist = addTickerToWatchlist.bind(this);
    }

    render() {
        const currentWatchlist = this.props.watchlist;
        return (
            <div className={"grid-header"}>
                <div style={{float: "left"}}>
                    <h3 className="ant-typography title" style={{display: "block"}}>Market overview</h3>
                    <h5 style={{fontStyle: 'italic', display: "block"}}>{currentWatchlist}</h5>
                </div>

                <div style={{float: "right"}}>
                    <div style={{display: "inline", padding: "0.5em"}}>
                        <SearchTickerAutocomplete addTickerToWatchlist={this.addTickerToWatchlist}/>
                    </div>
                    <div style={{display: "inline", padding: "0.5em"}}>
                        <button type="button" onClick={() => {
                            this.saveColumnsState();
                        }}
                                className="ant-btn ant-btn-link" style={{fontSize: '1.5em', display: "inline"}}>
                                <span role="img"
                                      aria-label="cloud-upload"
                                      style={{alignSelf: 'center'}}
                                      className="anticon anticon-cloud-upload">
                                    <SaveOutlined/>
                                    Save view
                                </span>
                        </button>
                    </div>
                    <div className="ant-btn ant-btn-link"
                         style={{
                             display: "inline",
                             margin: '0 auto',
                             fontSize: '1.5em',
                             padding: "0.5em",
                             width: 'min-content'
                         }}>
                        <Watchlists handleSelectWatchlist={(currentWatchlist) => {
                            this.handleSelectWatchlist(currentWatchlist);
                        }}/>
                        <div style={{alignSelf: 'center', display: 'inline'}}>
                            Watchlists
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}