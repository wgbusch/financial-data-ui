import './App.css';
import React from 'react';
import MainGrid from "./Components/ParentGrid/MainGrid";
import {
    deleteTickerFromWatchlist,
    getColumnsState,
    getCurrentWatchlist,
    getCurrentWatchlistContent,
    setColumnsState,
    setCurrentWatchlist,
    setUpLocalStorage,
    updateCurrentWatchlistWithNewTicker
} from "./Common/LocalStorageWrapper";
import GridHeader from "./Components/ParentGrid/GridHeader/GridHeader";
import {successNotification} from "./Components/ToastNotifications";
import {fetchQuotes} from "./Common/Hooks";
import dummyQuotesData from "./Common/dummyData/dummyQuotesData";
import columnsDef from "./Common/columnsDef";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columnsState: JSON.parse(getColumnsState()),
            rowData: [],
            watchlist: getCurrentWatchlist(),
        }
        this.saveColumnsState = this.saveColumnsState.bind(this);
        this.handleChangeOfColumns = this.handleChangeOfColumns.bind(this);
        this.showCurrentWatchlistTickers = this.showCurrentWatchlistTickers.bind(this);
        this.addTickerToWatchlist = this.addTickerToWatchlist.bind(this);
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
    }

    handleSelectWatchlist = (currentWatchlist) => {
        setCurrentWatchlist(currentWatchlist);
        this.showCurrentWatchlistTickers();
    }

    addTickerToWatchlist = (ticker) => {
        updateCurrentWatchlistWithNewTicker(ticker);
        this.showCurrentWatchlistTickers();
    }

    showCurrentWatchlistTickers = () => {
        const watchlistContent = getCurrentWatchlistContent().join(',');

        const callback = (httpRequest) => {

            this.setState({
                rowData: JSON.parse(httpRequest.responseText).data,
                watchlist: getCurrentWatchlist(),
            });
        };
        fetchQuotes(watchlistContent, callback, () => {
            this.setState({rowData: JSON.stringify(dummyQuotesData)});
        });
    }

    handleDeleteTickerFromWatchlist = (ticker) => {
        deleteTickerFromWatchlist(ticker, this.state.watchlist);
        this.setState({rowData: this.state.rowData.filter(row => row.symbol !== ticker)});
    }

    componentDidMount() {
        this.setUp();

        const updateData = (response) => {
            let existingColumns = [];
            if (response.columns) {
                response.columns.forEach(colName => {
                    if (columnsDef[colName.toLowerCase()]) {
                        existingColumns.push(columnsDef[colName.toLowerCase()])
                    }
                });
            } else {
                existingColumns = response.columns;
            }

            this.setState({
                    rowData: response.data,
                    columnDefs: existingColumns,
                    columnsState: JSON.parse(getColumnsState()),
                }
            );
        };

        const watchlistContent = getCurrentWatchlistContent().join(',');

        fetchQuotes(watchlistContent, (t) => {
            updateData((JSON.parse(t.responseText)))
        }, updateData);
    }

    render() {
        return (
            <div className="ag-theme-alpine container">
                <GridHeader
                    saveColumnsState={this.saveColumnsState}
                    handleSelectWatchlist={this.handleSelectWatchlist}
                    addTickerToWatchlist={this.addTickerToWatchlist}
                />
                <MainGrid
                    columnsState={this.state.columnsState}
                    handleChangeOfColumns={this.handleChangeOfColumns}
                    handleDeleteTickerFromWatchlist={this.handleDeleteTickerFromWatchlist}
                    rowData={this.state.rowData}
                    columnDefs={this.state.columnDefs}/>
            </div>
        );
    };
}

export default App;
