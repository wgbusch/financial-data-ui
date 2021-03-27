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
import columnsDefMainGrid from "./Common/columnsDefMainGrid";

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
        this.setState({watchlist: getCurrentWatchlist()});
        this.showCurrentWatchlistTickers();
    }

    addTickerToWatchlist = (ticker) => {
        updateCurrentWatchlistWithNewTicker(ticker);
        this.showCurrentWatchlistTickers();
    }

    showCurrentWatchlistTickers = () => {
        const callback = (httpRequest) => {
            const response = JSON.parse(httpRequest.responseText);

            this.setState({
                rowData: response.data,
            });

            if (response.nonExistingSymbols) {
                const currentWatchlist = getCurrentWatchlist();
                response.nonExistingSymbols.forEach(ticker => {
                    deleteTickerFromWatchlist(ticker, currentWatchlist)
                })
            }
        };

        const watchlistContent = getCurrentWatchlistContent().join(',');

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
            const columns = response.columns;
            if (columns) {
                columns.forEach(colName => {
                    if (columnsDefMainGrid[colName.toLowerCase()]) {
                        existingColumns.push(columnsDefMainGrid[colName.toLowerCase()])
                    }
                });
            } else {
                existingColumns = columns;
            }

            this.setState({
                    rowData: response.data,
                    columnDefs: existingColumns,
                    columnsState: JSON.parse(getColumnsState()),
                }
            );
        };

        const watchlistContent = getCurrentWatchlistContent().join(',');
        const callback = (t) => {
            updateData(JSON.parse(t.responseText))
        };
        fetchQuotes(watchlistContent, callback, updateData);
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
                    columnDefs={this.state.columnDefs}
                    loading={this.state.loading}/>
            </div>
        );
    };
}

export default App;
