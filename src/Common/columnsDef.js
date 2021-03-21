const columnsDef = {
    "ask": {
        "headerName": "Ask",
        "field": "ask",
        "type": "decimalColumn"
    },
    "bid": {
        "headerName": "Bid",
        "field": "bid",
        "type": "decimalColumn"
    },
    "change ": {
        "headerName": "Day change",
        "field": "change",
        "type": "changeColumn"
    },
    "change_percent": {
        "headerName": "Day change %",
        "field": "change_percent",
        "type": "percentageColumn"
    },
    "close": {
        "headerName": "Previous close",
        "field": "close",
        "type": "decimalColumn"
    },
    "date": {
        "headerName": "Last updated",
        "field": "Date",
        "width": 110
    },
    "day_high": {
        "headerName": "High",
        "field": "dayHigh",
        "type": "decimalColumn"
    },
    "day_low": {
        "headerName": "Low",
        "field": "dayLow",
        "type": "decimalColumn"
    },
    "high": {
        "headerName": "High",
        "field": "high",
        "type": "decimalColumn"
    },
    "is_etf": {
        "headerName": "ETF?",
        "field": "is_etf",
        "width": 90,
        "type":"booleanColumn"
    },
    "long_name": {
        "headerName": "Name",
        "field": "longName",
        "checkboxSelection": false,
        "width": 200
    },
    "low": {
        "headerName": "Low",
        "field": "low",
        "type": "decimalColumn"
    },
    "name": {
        "headerName": "Name",
        "field": "name",
        "checkboxSelection": false,
        "width": 200,
        "cellRenderer": "agGroupCellRenderer"
    },
    "open": {
        "headerName": "Open",
        "field": "open",
        "type": "decimalColumn"
    },
    "previous_close": {
        "headerName": "Prev. Close",
        "field": "previous_close",
        "type": "decimalColumn"
    },
    "quote": {
        "headerName": "Quote",
        "field": "quote",
        "type": "decimalColumn"
    },
    "quote_timestamp": {
        "headerName": "Quote date",
        "field": "quote_timestamp",
        "width": 110
    },
    "symbol": {
        "headerName": "Symbol",
        "field": "symbol"
    },
    "volume": {
        "headerName": "Volume",
        "field": "volume",
        "width": 110,
        "type": "integerColumn"
    },
}


export default columnsDef;