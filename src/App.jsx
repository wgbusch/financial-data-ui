import './App.css';
import React from 'react';
import ParentGrid from "./Components/ParentGrid/ParentGrid";
import {getColumnsState, setColumnsState, setCurrentWatchlist, setUpLocalStorage} from "./Common/LocalStorageWrapper";
import GridHeader from "./Components/ParentGrid/GridHeader/GridHeader";
import {successNotification} from "./Components/ToastNotifications";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columnsState: JSON.parse(getColumnsState()),
        }
        this.saveColumnsState = this.saveColumnsState.bind(this);
        this.handleChangeOfColumns = this.handleChangeOfColumns.bind(this);
    }

    setUp() {
        if (typeof (Storage) !== "undefined") {
            setUpLocalStorage();
        }
    }


    saveColumnsState = () => {
        let state = this.state.columnsState;
        setColumnsState(JSON.stringify(state));
        successNotification("View saved.");
    }

    handleChangeOfColumns = (params) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.columnsState = params;
        console.log("state changed.");
    }

    handleSelectWatchlist = (currentWatchlist) => {
        setCurrentWatchlist(currentWatchlist);
        this.showCurrentWatchlistTickers();
    }

    componentDidMount() {
        this.setUp();
    }

    render() {
        return (
            <div className="ag-theme-alpine container">
                <GridHeader
                    // watchlist={this.state.watchlist}
                    saveColumnsState={this.saveColumnsState}
                    // handleSelectWatchlist={this.handleSelectWatchlist}
                    // addTickerToWatchlist={this.addTickerToWatchlist}
                />
                <ParentGrid
                    columnsState={this.state.columnsState}
                    handleChangeOfColumns={this.handleChangeOfColumns}/>
            </div>
        );
    }

;
}

export default App;
