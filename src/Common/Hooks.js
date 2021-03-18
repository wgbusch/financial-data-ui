import {tickers} from "./endpoints";


export function fetchQuotes(quotes, callback, fallback){

    const httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        tickers + quotes,
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