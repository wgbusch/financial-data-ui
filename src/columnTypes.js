export function columnTypes() {


    let numberFormat = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal'
        }).format(value);
    }

    let decimalFormatter = (params) => {
        let number = params.value;
        if (isNaN(number)) {
            return 'NaN';
        } else {
            return parseFloat(parseFloat(number).toFixed(3));
        }
    }

    let integerFormatter = (params) => {
        let integer = params.value;
        return numberFormat(integer);
    }

    let unixTimeFormatter = (params) => {
        const milliseconds = params.value;
        const dateObject = new Date(milliseconds);
        return dateObject.toLocaleString();
    }

    let percentageFormatter = (params) => {
        const percentage = parseFloat(params.value).toFixed(2);
        return percentage + "%"
    };

    let percentageStyle = function (params) {
        let number = parseFloat(params.value);
        let style = {};
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

    let changeStyle = function (params) {
        let number = parseFloat(params.value);
        let style = {};
        if (number < 0) {
            style["color"] = 'red';
        } else if (number > 0) {
            style["color"] = 'green';
        } else {
            style["color"] = 'blue';
        }
        return style;
    };

    return {
        booleanColumn: {
            width: 80,
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
                    var valA = Date.parse(a);
                    var valB = Date.parse(b);

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