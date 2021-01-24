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
import GridHeader from "./GridHeader";

export default class ParentGrid extends React.Component {

    BACKEND = {
        marketOverview: 'http://127.0.0.1:5000/api/v1/market-overview/?start=0&end=500',
    }

    constructor(props) {
        super(props);
        this.handleOnSelectionChanged = this.handleOnSelectionChanged.bind(this);
        this.getColumnState = this.getColumnState.bind(this);
        this.handleFirstDataRendered = this.handleFirstDataRendered.bind(this)

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
            displaySymbol: "SPY",
            pagination: true,
            view: 'all',
            keepDetailRows: true,
            detailRowHeight: 400,
            detailCellRenderer: 'detailGrid',
            frameworkComponents: {detailGrid: DetailGrid},
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

        httpRequest.open(
            'GET',
            this.BACKEND['marketOverview']
        );
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                updateData(JSON.parse(httpRequest.responseText));
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

    render() {
        return (
            <div className="splitScreen">
                <ResizePanel style={{width: '200%'}} direction="e">
                    <div className="ag-theme-alpine leftPane container">
                        <GridHeader getColumnState={this.getColumnState}/>
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
                </ResizePanel>
                <Chart symbol={this.state.displaySymbol} className="rightPane container"/>
            </div>
        )
    }
}