import {AgGridReact} from "ag-grid-react";

import 'ag-grid-enterprise';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise/dist/styles/ag-theme-alpine.css';
import React from 'react';
import './ParentGrid.css';
import {columnTypes} from "../../Common/columnTypes";
import DetailGrid from "./DetailGrid/DetailGrid";

export default class MainGrid extends React.Component {
    countNum = 0;

    constructor(props) {
        super(props);
        this.handleColumnChange = this.handleColumnChange.bind(this);
        this.handleFirstDataRendered = this.handleFirstDataRendered.bind(this);
        this.handleOnGridReady = this.handleOnGridReady.bind(this);
        this.getContextMenuItems = this.getContextMenuItems.bind(this);
        this.handleDeleteTickerFromWatchlist = this.props.handleDeleteTickerFromWatchlist.bind(this);
        this.handleRowDataChanged = this.handleRowDataChanged.bind(this);
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
            pagination: true,
            keepDetailRows: true,
            detailRowHeight: 400,
            detailCellRenderer: 'detailGrid',
            frameworkComponents: {detailGrid: DetailGrid},
        }
    }

    handleFirstDataRendered = () => {
        this.gridColumnApi.applyColumnState({
            state: this.props.columnsState,
            applyOrder: true,
        });
    }

    handleOnGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    };

    getContextMenuItems = () => {
        return [
            {
                name: "Delete watchlist.",
                action: () => {
                    const rowSelected = this.gridApi.getSelectedRows()[0];
                    if (rowSelected) {
                        const ticker = rowSelected.symbol;
                        this.handleDeleteTickerFromWatchlist(ticker);
                    }
                },
            },
            'separator',
            'copy',
            'copyWithHeaders',
            'export'
        ];
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("component did update");
    }

    handleColumnChange = () => {
        this.props.handleChangeOfColumns(this.gridColumnApi.getColumnState());
    }

    handleRowDataChanged =() =>{
        console.log("handle row data changed");
    }

    render() {
        this.countNum++;
        console.log(this.countNum);
        return (
            <>
                <AgGridReact
                    rowSelection={this.state.rowSelection}
                    rowData={this.props.rowData}
                    onGridReady={this.handleOnGridReady}
                    onFirstDataRendered={this.handleFirstDataRendered}
                    defaultColDef={this.state.defaultColDef}
                    columnDefs={this.props.columnDefs}
                    masterDetail={this.state.masterDetail}
                    detailRowHeight={this.state.detailRowHeight}
                    detailCellRenderer={this.state.detailCellRenderer}
                    getContextMenuItems={this.getContextMenuItems}
                    onColumnResized={this.handleColumnChange}
                    onDragStopped={this.handleColumnChange}
                    onSortChanged={this.handleColumnChange}
                    onFilterChanged={this.handleColumnChange}
                    frameworkComponents={this.state.frameworkComponents}
                    keepDetailRows={this.state.keepDetailRows}
                    columnTypes={this.state.columnTypes}
                    pagination={this.state.pagination}
                    onRowDataChanged={this.handleRowDataChanged}
                >
                </AgGridReact>
            </>
        )
    }
}