import {AgGridReact} from "ag-grid-react";

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import React from 'react';
import ResizePanel from "react-resize-panel";
import Chart from "./Chart";
import './ParentGrid.css';
import {columnTypes} from "./columnTypes";
import DetailGrid from "./DetailGrid/DetailGrid";
import GridHeader from "./GridHeader/GridHeader";
import {LocalStorageWrapper} from "./LocalStorageWrapper";
import dummyData from "./dummyData";
import dummyResponse from "./dummyData";

export default class ParentGrid extends React.Component {

    BACKEND = {
        marketOverview: process.env.REACT_APP_BACKEND + 'market-overview/?start=0&end=40',
        tickers: process.env.REACT_APP_BACKEND + '?tickers=',

    }

    constructor(props) {
        super(props);
        this.handleOnSelectionChanged = this.handleOnSelectionChanged.bind(this);
        this.handleFirstDataRendered = this.handleFirstDataRendered.bind(this)
        this.getColumnState = this.getColumnState.bind(this);
        // this.getCurrentWatchlist = this.getCurrentWatchlist.bind(this);

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
            rowData: null,
            pagination: true,
            view: 'all',
            keepDetailRows: true,
            detailRowHeight: 400,
            detailCellRenderer: 'detailGrid',
            frameworkComponents: {detailGrid: DetailGrid},
            watchlist: null
        }
    }

    handleFirstDataRendered = (params) => {
        this.gridColumnApi.applyColumnState({
            state: this.state.columnsState,
            applyOrder: true,
        });
    }

    handleOnGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        const httpRequest = new XMLHttpRequest();
        const updateData = (response) => {
            this.setState({
                    rowData: response.data,
                    columnDefs: response.columnDefs,
                    columnsState: JSON.parse(response.columnsState),
                }
            );
        };
        //
        // const localStorage = new LocalStorageWrapper();
        // const currentWatchlist = localStorage.getCurrentWatchlist();
        // this.setState({watchlist: currentWatchlist});

        // const watchlistContent = localStorage.getWatchlistContent(currentWatchlist).join(',');

        httpRequest.open(
            'GET',
            this.BACKEND['marketOverview']
        );
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    updateData(JSON.parse(httpRequest.responseText));
                } else {
                    const x = dummyResponse;
                    updateData(x);
                }
            }
        };
    };

    handleOnSelectionChanged = () => {
        const selectedRows = this.gridApi.getSelectedRows();
        this.setState({displaySymbol: selectedRows.length === 1 ? selectedRows[0]["Symbol"] : this.state.displaySymbol})
    };

    getColumnState = () => {
        return this.gridColumnApi.getColumnState();
    }

    getCurrentWatchlist = (currentWatchlist) => {
        this.setState({watchlist: currentWatchlist});
    }

    render() {
        return (
            <div className="ag-theme-alpine">
                {/*<GridHeader getColumnState={this.getColumnState} getCurrentWatchlist={this.getCurrentWatchlist}/>*/}
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
                    frameworkComponents={this.state.frameworkComponents}
                    keepDetailRows={this.state.keepDetailRows}
                    columnTypes={this.state.columnTypes}
                    pagination={this.state.pagination}>
                </AgGridReact>
            </div>
        )
    }
}