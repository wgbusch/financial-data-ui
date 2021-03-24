import {AutoComplete, Input} from "antd";
import React, {useState} from "react";
import {searchTicker} from "../../../Common/Hooks";
import dummySearchData from "../../../Common/dummyData/dummySearchData";


export default function SearchTickerAutocomplete({addTickerToWatchlist}) {

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

        const updateSearchResults = (response) => {
            const foundTickers = JSON.parse(response.responseText);

            const options = foundTickers.map((ticker) => {
                return renderItem({symbol: ticker[0].toUpperCase()})
            });

            function uniqueOpts(list) {
                const seen = {};
                return list.filter(function (item) {
                    const ticker = item.value;
                    return seen.hasOwnProperty(ticker) ? false : (seen[ticker] = true);
                })
            }

            const uniqueOptions = uniqueOpts(options)

            setOptions([{label: renderTitle('Stocks'), options: uniqueOptions}])
        }


        if (value) {
            searchTicker(value, (response) => {
                    updateSearchResults(response)
                },
                (response) => {
                    updateSearchResults(dummySearchData)
                });
        }
    }

    return (<>
        <AutoComplete
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            style={{width: 250,}}
            options={options}
            onChange={handleInput}
            onSelect={(ticker) => {
                addTickerToWatchlist(ticker);
            }}
        >
            <Input.Search size="large" placeholder="A ticker. Eg. AAPL"/>
        </AutoComplete>
    </>);
}
