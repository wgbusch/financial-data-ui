import React from "react";
import {columnTypes} from "../../../Common/columnTypes";
import buyOrWriteCellMainRenderer from "./buyOrWriteCellMainRenderer";
import BuyOrWriteCellOptionRenderer from "./BuyOrWriteCellOptionRenderer";
import {AgGridReact} from "ag-grid-react";


export default class OptionsGrid extends React.Component {

    constructor(props) {
        super(props);

        const rowId = this.props.node.id;

        // this.inTheMoney = this.inTheMoney.bind(this);

        this.state = {
            defaultColDef: {
                floatingFilter: true,
                resizable: true,
                sortable: true,
                filter: 'agTextColumnFilter',
            },
            columnTypes: columnTypes(),
            rowSelection: 'single',
            rowData: [],
            rowId: rowId,
            // frameworkComponents: {
            //     buyOrWriteCellMainRenderer: buyOrWriteCellMainRenderer,
            //     buyOrWriteCellOptionRenderer: BuyOrWriteCellOptionRenderer
            // },
            // rowClassRules: {
            //     'in-the-money': this.inTheMoney
            // },
        }
    }

    handleOnGridReady = (params) => {
        console.log(params)
        const gridInfo = {
            id: this.props.node.id,
            api: params.api,
            columnApi: params.columnApi,
        };
        const valX = this.props.calls.concat(this.props.puts);
        this.setState({rowData: valX});
        this.props.api.addDetailGridInfo(this.state.rowId, gridInfo);
    };

    render() {
        return (
            <div className="ag-theme-alpine detailGridcontainer">
                <AgGridReact
                    id="detailGrid"
                    rowSelection={this.state.rowSelection}
                    rowData={this.props.calls}
                    rowClassRules={this.state.rowClassRules}
                    onGridReady={this.handleOnGridReady}
                    // pagination={this.state.pagination}
                    defaultColDef={this.state.defaultColDef}
                    // frameworkComponents={this.state.frameworkComponents}
                    columnDefs={this.props.columnsDef}
                    columnTypes={this.state.columnTypes}>
                </AgGridReact>
            </div>
        )
    }
}