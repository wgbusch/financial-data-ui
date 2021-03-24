import React from "react";
import {columnTypes} from "../../../Common/columnTypes";
import buyOrWriteCellMainRenderer from "./buyOrWriteCellMainRenderer";
import BuyOrWriteCellOptionRenderer from "./BuyOrWriteCellOptionRenderer";
import ExpiryDateDropdown from "./ExpiryDateDropdown";
import RunValuation from "./RunValuation";
import {AgGridReact} from "ag-grid-react";


export default class OptionsGrid extends React.Component {

    constructor(props) {
        super(props);

        this.inTheMoney = this.inTheMoney.bind(this);

        this.state = {
            defaultColDef: {
                floatingFilter: true,
                resizable: true,
                sortable: true,
                filter: 'agTextColumnFilter',
            },
            rowId: props.node.id,
            masterGridApi: props.api,
            columnTypes: columnTypes(),
            rowSelection: 'single',
            rowData: null,
            frameworkComponents: {
                buyOrWriteCellMainRenderer: buyOrWriteCellMainRenderer,
                buyOrWriteCellOptionRenderer: BuyOrWriteCellOptionRenderer
            },
            rowClassRules: {
                'in-the-money': this.inTheMoney
            },
        }
    }

    handleOnGridReady = (params) => {
        console.log(params)
        const gridInfo = {
            id: this.state.rowId,
            api: params.api,
            columnApi: params.columnApi,
        };

        const httpRequest = new XMLHttpRequest();
        httpRequest.open(
            'GET',
            'http://127.0.0.1:5000/api/v1/options/option_dates/' + this.props.data["Symbol"] + '/'
        );
        httpRequest.send();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                let jsonResponse = JSON.parse(httpRequest.responseText);
                this.setState({
                    rowData: jsonResponse.data,
                    columnDefs: jsonResponse.columnDefs,
                    columnTypes: {
                        ...this.state.columnTypes,
                        expiryDate: {
                            ...this.state.columnTypes.expiryDate,
                            filterParams: {
                                ...this.state.columnTypes.expiryDate.filterParams,
                                values: jsonResponse.expiryDates
                            }
                        }
                    }
                })
            }
        };

        this.state.masterGridApi.addDetailGridInfo(this.state.rowId, gridInfo);
    };

    inTheMoney = (params) => {
        let strikePrice = params.data.strike;
        let closePrice = this.props.data.Close;
        return parseInt(strikePrice) <= parseInt(closePrice);
    }

    render() {
        return (
            <div className="ag-theme-alpine detailGridcontainer">
                <AgGridReact
                    id="detailGrid"
                    rowSelection={this.state.rowSelection}
                    rowData={this.state.rowData}
                    rowClassRules={this.state.rowClassRules}
                    onGridReady={this.handleOnGridReady}
                    pagination={this.state.pagination}
                    defaultColDef={this.state.defaultColDef}
                    frameworkComponents={this.state.frameworkComponents}
                    columnDefs={this.state.columnDefs}
                    columnTypes={this.state.columnTypes}>
                </AgGridReact>
            </div>
        )
    }
}