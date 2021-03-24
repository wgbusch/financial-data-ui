import 'ag-grid-enterprise';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise/dist/styles/ag-theme-alpine.css';
import React from 'react';
import {columnTypes} from "../../../Common/columnTypes";
import './TickerDetails.css'
import buyOrWriteCellMainRenderer from "./buyOrWriteCellMainRenderer";
import BuyOrWriteCellOptionRenderer from "./BuyOrWriteCellOptionRenderer";
import ExpiryDateDropdown from "./ExpiryDateDropdown";
import RunValuation from "./RunValuation";
import OptionsGrid from "./OptionsGrid";

export default class TickerDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="ag-theme-alpine detailGridcontainer">
                <div style={{display: 'inline-block'}}>
                    <ExpiryDateDropdown expiryDates={this.state.columnTypes.expiryDate.filterParams.values}/>
                    <RunValuation/>
                </div>
                <OptionsGrid/>
            </div>
        )
    }

    componentWillUnmount = () => {
        console.log('removing detail grid info with id: ', this.state.rowId);

        // the detail grid is automatically destroyed as it is a React component
        this.state.masterGridApi.removeDetailGridInfo(this.state.rowId);
    };
}