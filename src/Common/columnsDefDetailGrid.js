const columnsDefDetailGrid = {
    "contract_symbol": {
        "headerName": "Contract Symbol",
        "field": "contract_symbol",
    },
    "last_trade_date": {
        "headerName": "Last Trade Date",
        "field": "last_trade_date",
    },
    "strike ": {
        "headerName": "Strike",
        "field": "strike",
        "type": "decimalColumn",
    },
    "last_price": {
        "headerName": "Last price",
        "field": "last_price",
        "type": "decimalColumn",
    },
    "bid": {
        "headerName": "Bid",
        "field": "bid",
        "type": "decimalColumn",
    },
    "ask": {
        "headerName": "Ask",
        "field": "ask",
        "type": "decimalColumn",
        "width": 110,
    },
    "change": {
        "headerName": "Change",
        "field": "change",
        "type": "changeColumn",
    },
    "percent_change": {
        "headerName": "Percent Change",
        "field": "percent_change",
        "type": "percentageColumn",
    },
    "volume": {
        "headerName": "Volume",
        "field": "volume",
        "type": "decimalColumn"
    },
    "open_interest": {
        "headerName": "Open Interest",
        "field": "open_interest",
        "width": 90,
        "type": "decimalColumn"
    },
    "implied_volatility": {
        "headerName": "Implied Volatility",
        "field": "implied_volatility",
        "type": "decimalColumn",
        "checkboxSelection": false,
        "width": 200
    },
    "in_the_money": {
        "headerName": "In the Money",
        "field": "in_the_money",
        "type": "booleanColumn",
        "checkboxSelection": false
    },
    "contract_size": {
        "headerName": "Contract Size",
        "field": "contract_size",
        "checkboxSelection": false,
        "width": 200,
    },
    "currency": {
        "headerName": "Currency",
        "field": "currency",
        "checkboxSelection": false
    }
}


export default columnsDefDetailGrid;