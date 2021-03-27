import 'ag-grid-enterprise';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise/dist/styles/ag-theme-alpine.css';
import React, {useEffect, useState} from 'react';
import './TickerDetails.css'
import ExpiryDateDropdown from "./ExpiryDateDropdown";
import RunValuation from "./RunValuation";
import OptionsGrid from "./OptionsGrid";
import {fetchOptionsInformation} from "../../../Common/Hooks";
import columnsDefDetailGrid from "../../../Common/columnsDefDetailGrid";

export default function TickerDetails({data, node, api}) {

    const [expiryDates, setExpiryDates] = useState([]);
    const [calls, setCalls] = useState([]);
    const [puts, setPuts] = useState([]);
    const [columnsDef, setColumnsDef] = useState([]);
    const [symbol, setSymbol] = useState(data.symbol);
    const [countNum, setCountNum] = useState(data.symbol);

    useEffect(() => {
        fetchOptionsInformation(data.symbol, (httpResponse) => {
            const response = JSON.parse(httpResponse.responseText);
            const data = response["data"];

            let existingColumns = [];

            const columns = response["columns"];

            if (columns) {
                columns.forEach(colName => {
                    if (columnsDefDetailGrid[colName.toLowerCase()]) {
                        existingColumns.push(columnsDefDetailGrid[colName.toLowerCase()])
                    }
                });
            } else {
                existingColumns = columns;
            }


            setExpiryDates(data["expiration_dates"]);
            setCalls(data["calls"]);
            setPuts(data["puts"]);
            setColumnsDef(existingColumns);

            console.log(httpResponse);
        }, () => {
            console.log("hola")
        });
    }, symbol);

    // useEffect(() => {
    //     fetchOptionsInformation(data.symbol, (httpResponse) => {
    //
    //         const response = JSON.parse(httpResponse.responseText);
    //
    //         setExpiryDates(response["expiration_dates"]);
    //         setOptionChain(response["option_chain"]);
    //
    //         console.log(httpResponse);
    //     }, () => {
    //         console.log("hola")
    //     });
    // }, []);

    return (
        <div className="ag-theme-alpine detailGridcontainer">
            <div style={{display: 'inline-block'}}>
                <ExpiryDateDropdown expiryDates={expiryDates}/>
                <span> {data.symbol}</span>
                <RunValuation/>
            </div>
            <OptionsGrid node={node} api={api} calls={calls} puts={puts} columnsDef={columnsDef}/>
        </div>
    )

}