import {AgGridReact} from "ag-grid-react";

import 'ag-grid-enterprise';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise/dist/styles/ag-theme-alpine.css';
import React from 'react';
import './ParentGrid.css';
import {columnTypes} from "../../Common/columnTypes";
import DetailGrid from "./DetailGrid/DetailGrid";
import GridHeader from "./GridHeader/GridHeader";
import {
    deleteTickerFromWatchlist,
    getColumnsState,
    getCurrentWatchlist,
    getCurrentWatchlistContent,
    setColumnsState,
    setCurrentWatchlist,
    updateCurrentWatchlistWithNewTicker
} from "../../Common/LocalStorageWrapper";
import dummyQuotesData from "../../Common/dummyData/dummyQuotesData";
import columnsDef from "../../Common/columnsDef";
import {fetchQuotes} from "../../Common/Hooks";
import {successNotification} from "../ToastNotifications";

export default class ParentGrid extends React.Component {
    countNum = 0;

    constructor(props) {
        super(props);
        // this.handleOnSelectionChanged = this.handleOnSelectionChanged.bind(this);
        // this.handleFirstDataRendered = this.handleFirstDataRendered.bind(this)
        // this.saveColumnsState = this.props.saveColumnsState.bind(this);
        // this.handleSelectWatchlist = this.handleSelectWatchlist.bind(this);
        // this.showCurrentWatchlistTickers = this.showCurrentWatchlistTickers.bind(this);
        // this.getContextMenuItems = this.getContextMenuItems.bind(this);
        // this.handleColumnEverythingChanged = this.handleColumnEverythingChanged.bind(this);
        this.handleChangeOfColumns = this.props.handleChangeOfColumns.bind(this);

        this.state = {
            defaultColDef: {
                width: 100,
                floatingFilter: true,
                filter: 'agTextColumnFilter',
                resizable: true,
                sortable: true,
            },
            columnTypes: columnTypes(),
            masterDetail: true,
            rowSelection: 'single',
            columnsState: props.columnsState,
            rowData: null,
            pagination: true,
            keepDetailRows: true,
            detailRowHeight: 400,
            detailCellRenderer: 'detailGrid',
            frameworkComponents: {detailGrid: DetailGrid},
            watchlist: null
        }

    }


    handleFirstDataRendered = () => {
        this.gridColumnApi.applyColumnState({
            state: this.state.columnsState,
            applyOrder: true,
        });
    }

    handleOnGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

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

            const currentWatchlist = getCurrentWatchlist();
            this.setState({
                    rowData: response.data,
                    columnDefs: existingColumns,
                    // columnsState: JSON.parse(getColumnsState()),
                    watchlist: currentWatchlist,
                }
            );
        };

        const watchlistContent = getCurrentWatchlistContent().join(',');

        fetchQuotes(watchlistContent, (t) => {
            updateData((JSON.parse(t.responseText)))
        }, updateData);
    };

    handleOnSelectionChanged = () => {
        const selectedRows = this.gridApi.getSelectedRows();
        this.setState({displaySymbol: selectedRows.length === 1 ? selectedRows[0]["Symbol"] : this.state.displaySymbol})
    };

    // saveColumnsState = () => {
    //     let state = this.gridColumnApi.getColumnState();
    //     setColumnsState(JSON.stringify(state));
    //     successNotification("View saved.");
    // }

    handleSelectWatchlist = (currentWatchlist) => {
        setCurrentWatchlist(currentWatchlist);
        this.showCurrentWatchlistTickers();
    }

    addTickerToWatchlist = (ticker) => {
        updateCurrentWatchlistWithNewTicker(ticker);
        this.showCurrentWatchlistTickers();
    }

    showCurrentWatchlistTickers = () => {
        this.gridApi.showLoadingOverlay();
        const watchlistContent = getCurrentWatchlistContent().join(',');

        const callback = (httpRequest) => {
            this.gridApi.hideOverlay();

            this.setState({
                rowData: JSON.parse(httpRequest.responseText).data,
                watchlist: getCurrentWatchlist(),
            });
        };
        fetchQuotes(watchlistContent, callback, () => {
            this.setState({rowData: JSON.stringify(dummyQuotesData)});
        });
    }

    getContextMenuItems = (params) => {
        return [
            {
                name: 'Delete watchlist',
                action: () => {
                    const rowSelected = this.gridApi.getSelectedRows()[0];
                    const ticker = rowSelected.symbol;
                    deleteTickerFromWatchlist(ticker, this.state.watchlist);
                    this.setState({rowData: this.state.rowData.filter(row => row.symbol !== ticker)});
                },
            },
            'separator',
            'copy',
            'copyWithHeaders',
            'export'
        ];
    };

    render() {
        this.countNum++;
        console.log(this.countNum);
        return (
            <AgGridReact
                rowSelection={this.state.rowSelection}
                rowData={this.state.rowData}
                onSelectionChanged={this.handleOnSelectionChanged}
                onGridReady={this.handleOnGridReady}
                onFirstDataRendered={this.handleFirstDataRendered}
                defaultColDef={this.state.defaultColDef}
                columnDefs={this.state.columnDefs}
                masterDetail={this.state.masterDetail}
                detailRowHeight={this.state.detailRowHeight}
                detailCellRenderer={this.state.detailCellRenderer}
                getContextMenuItems={this.getContextMenuItems}
                onColumnResized={ () => {
                    let state = this.gridColumnApi.getColumnState();
                    this.handleChangeOfColumns(state);
                }}
                onDragStopped={ () => {
                    let state = this.gridColumnApi.getColumnState();
                    this.handleChangeOfColumns(state);
                }}
                frameworkComponents={this.state.frameworkComponents}
                keepDetailRows={this.state.keepDetailRows}
                columnTypes={this.state.columnTypes}
                pagination={this.state.pagination}

            >
            </AgGridReact>
        )
    }
}