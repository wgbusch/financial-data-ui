import {options, search, tickers} from "./endpoints";


export function fetchQuotes(tickersToFetch, callback, fallback) {
    getCall(`${tickers}${tickersToFetch}`, callback, fallback);
}

export function searchTicker(searchQuery, callback, fallback) {
    getCall(`${search}${searchQuery}`, callback, fallback);
}

export function fetchOptionsInformation(symbol, callback, fallback) {
    getCall(`${options}${symbol}`, callback, fallback);
}

const getCall = (url, callback, fallback) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        url
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                callback(httpRequest);
            } else {
                fallback(httpRequest);
            }
        }
    };
}