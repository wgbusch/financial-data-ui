import {AutoComplete, Input} from "antd";
import React, {useState} from "react";
import {searchTicker} from "../../../Common/Hooks";


export default function SearchTickerAutocomplete() {

    const renderTitle = (title) => (
        <span>
            {title}
        </span>
    );

    const renderItem = (data, count) => ({
        value: data.symbol,
        label: (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {data.symbol}
                <span>
                    <img src={`https://storage.googleapis.com/iex/api/logos/${data.symbol}.png`}
                         style={{display: 'flex', height: '21px'}}
                         alt={'Logo'}/>
                    {count}
                  </span>
            </div>
        ),
    });

    const [options, setOptions] = useState([]);

    function handleInput(value) {
        if (value) {
            searchTicker(value, (response) => {
                    const found_tickers = JSON.parse(response.responseText);

                    let options = []
                    options = found_tickers.map((ticker) => {
                        return renderItem({symbol: ticker[0].toUpperCase()})
                    })
                    setOptions([{label: renderTitle('Stocks'), options: options}])
                },
                (response) => {
                    setOptions([])
                }
            );
        }
    }

    function handleSelection(value) {


    }

    return (<>
                <AutoComplete
                    dropdownClassName="certain-category-search-dropdown"
                    dropdownMatchSelectWidth={500}
                    style={{width: 250,}}
                    options={options}
                    onChange={handleInput}
                    onSelect={handleSelection}
                >
                    <Input.Search size="large" placeholder="A ticker. Eg. AAPL"/>
                </AutoComplete>
            </>);
}
