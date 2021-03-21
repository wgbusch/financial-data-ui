import {AgGridReact} from "ag-grid-react";

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import React from 'react';
import './ParentGrid.css';
import {columnTypes} from "../../Common/columnTypes";
import DetailGrid from "./DetailGrid/DetailGrid";
import GridHeader from "./GridHeader/GridHeader";
import {LocalStorageWrapper} from "../../Common/LocalStorageWrapper";
import dummyData from "../../Common/dummyData";
import columnsDef from "../../Common/columnsDef";
import {fetchQuotes} from "../../Common/Hooks";

export default class ParentGrid extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnSelectionChanged = this.handleOnSelectionChanged.bind(this);
        this.handleFirstDataRendered = this.handleFirstDataRendered.bind(this)
        this.getColumnState = this.getColumnState.bind(this);
        this.setCurrentWatchlist = this.setCurrentWatchlist.bind(this);

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

        const updateData = (response) => {
            const existingColumns = [];
            if (response.columns != null) {
                response.columns.forEach(colName => {
                    if (columnsDef[colName.toLowerCase()]) {
                        existingColumns.push(columnsDef[colName.toLowerCase()])
                    }
                });
            }

            const local = new LocalStorageWrapper();
            this.setState({
                    rowData: response.data,
                    columnDefs: existingColumns,
                    columnsState: JSON.parse(local.getColumnsState()),
                }
            );
        };

        const localStorage = new LocalStorageWrapper();
        const currentWatchlist = localStorage.getCurrentWatchlist();
        this.setState({watchlist: currentWatchlist});

        const watchlistContent = localStorage.getWatchlistContent(currentWatchlist).join(',');

        fetchQuotes(watchlistContent, (t) => {
            updateData((JSON.parse(t.responseText)))
        }, updateData);
    };

    handleOnSelectionChanged = () => {
        const selectedRows = this.gridApi.getSelectedRows();
        this.setState({displaySymbol: selectedRows.length === 1 ? selectedRows[0]["Symbol"] : this.state.displaySymbol})
    };

    getColumnState = () => {
        return this.gridColumnApi.getColumnState();
    }

    setCurrentWatchlist = (currentWatchlist) => {
        this.setState({watchlist: currentWatchlist});
        this.gridApi.showLoadingOverlay();
        const localStorage = new LocalStorageWrapper();

        const watchlistContent = localStorage.getWatchlistContent(currentWatchlist).join(',');

        const callback = (httpRequest) => {
            this.gridApi.hideOverlay();
            const response = JSON.parse(httpRequest.responseText);
            this.setState({
                rowData: response.data
            });
        };

        fetchQuotes(watchlistContent, callback, (httpRequest) => {
            this.setState({rowData: JSON.stringify(dummyData)});
        });
    }

    render() {
        return (
            <div className="ag-theme-alpine container">
                <GridHeader watchlist={this.state.watchlist} getColumnState={this.getColumnState}
                            setCurrentWatchlist={this.setCurrentWatchlist}/>
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