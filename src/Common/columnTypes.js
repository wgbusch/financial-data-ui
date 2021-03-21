export function columnTypes() {


    const numberFormat = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal'
        }).format(value);
    }

    const decimalFormatter = (params) => {
        const number = params.value;
        if (!number) return '-';
        return parseFloat(parseFloat(number).toFixed(3));
    }

    const integerFormatter = (params) => {
        const integer = params.value;
        return numberFormat(integer);
    }

    const unixTimeFormatter = (params) => {
        const milliseconds = params.value;
        const dateObject = new Date(milliseconds);
        return dateObject.toLocaleString();
    }

    const percentageFormatter = (params) => {
        let value;
        if (params.value === Number(params.value)) {
            value = params.value
        } else {
            value = params.value[0]
        }
        const percentage = (100 * parseFloat(value)).toFixed(2);
        return percentage + "%"
    };

    const percentageStyle = function (params) {
        let value;
        if (params.value === Number(params.value)) {
            value = params.value
        } else {
            value = params.value[0]
        }
        const number = 100 * parseFloat(value);
        const style = {};
        if (number < -1) {
            style["color"] = 'red';
        } else if (number > 1) {
            style["color"] = 'green';
        } else {
            style["color"] = 'blue';
        }
        if (Math.abs(number) > 10) {
            style["fontWeight"] = 'bold';
        }
        return style;
    };

    const changeStyle = function (params) {
        const number = parseFloat(params.value);
        const style = {};
        if (number < 0) {
            style["color"] = 'red';
        } else if (number > 0) {
            style["color"] = 'green';
        } else {
            style["color"] = 'blue';
        }
        return style;
    };

    const booleanFormatter = function (params) {
        if (params.value) return 'Y';
        return 'N'
    };

    const booleanStyle = function () {
        return {"fontWeight": "bold"};
    };

    return {
        booleanColumn: {
            width: 80,
            cellStyle: booleanStyle,
            valueFormatter: booleanFormatter,
        },
        decimalColumn: {
            width: 107,
            filter: 'agNumberColumnFilter',
            valueFormatter: decimalFormatter,
        },
        integerColumn: {
            width: 110,
            filter: 'agNumberColumnFilter',
            valueFormatter: integerFormatter,
        },
        percentageColumn: {
            cellStyle: percentageStyle,
            valueFormatter: percentageFormatter
        },
        changeColumn: {
            cellStyle: changeStyle,
            valueFormatter: decimalFormatter
        },
        expiryDate: {
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
                values: [],
                comparator: function (a, b) {
                    const valA = Date.parse(a);
                    const valB = Date.parse(b);

                    if (valA === valB) return 0;
                    return valA > valB ? 1 : -1;
                }
            }
        },
        callOrPut: {
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
                values: ["call", "put"],
            }
        },
        buyOrWrite: {
            editable: true,
            filter: false,
            singleClickEdit: true,
            cellRenderer: 'buyOrWriteCellMainRenderer',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
                values: [' ', 'Buy', 'Write'],
                cellRenderer: 'buyOrWriteCellOptionRenderer',
            },
        },
        unixTimeColumn: {
            valueFormatter: unixTimeFormatter
        }
    };
}