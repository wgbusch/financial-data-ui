import {search, tickers} from "./endpoints";


export function fetchQuotes(tickersToFetch, callback, fallback) {

    const httpRequest = new XMLHttpRequest();
    const url = tickers + tickersToFetch;
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

export function searchTicker(searchQuery, callback, fallback) {

    const httpRequest = new XMLHttpRequest();
    const url = search + searchQuery;
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