import initialGridState from "./initialGridState";


const WATCHLISTS_KEY = 'watchlists'
const CURRENT_WATCHLIST_KEY = 'currentWatchlist'
export const DEFAULT_WATCHLIST_NAME = 'default';
const DEFAULT_WATCHLIST_VALUE = 'AAPL,GOOGL,TSLA,SPY,IWM';
const COLUMNS_STATE_KEY = 'columnsState';
const localStorage = window.localStorage;

// constructor()
// {
//     localStorage = window.localStorage;
// }

export function getWatchlistsNames()
{
    const watchlists = localStorage.getItem(WATCHLISTS_KEY)
    return watchlists.split(',').filter(Boolean);
}

export function addWatchlist(name)
{
    const existingNames = getWatchlistsNames();
    if (name && name.match('^[a-zA-Z0-9 ]{1,20}$') && !existingNames.includes(name)) {
        if (localStorage.getItem(name)) return
        localStorage.setItem(name, '')
        const watchlists = localStorage.getItem(WATCHLISTS_KEY)
        localStorage.setItem(WATCHLISTS_KEY, `${watchlists}${name},`)
    }
}

export function updateCurrentWatchlistWithNewTicker(ticker)
{
    const currentWatchlist = getCurrentWatchlist();
    const content = localStorage.getItem(currentWatchlist);
    const newContent = content ? `${content},${ticker}` : ticker;
    localStorage.setItem(currentWatchlist, newContent);
    return newContent.split(',').filter(Boolean);
}

export function deleteWatchlist(watchlistToDelete)
{
    if (!watchlistToDelete || watchlistToDelete === DEFAULT_WATCHLIST_NAME) return -1;

    const currentWatchlist = getCurrentWatchlist();
    let newListOfWatchlists = '';
    const watchlists = getWatchlistsNames();
    watchlists.forEach(watchlist => {
        if (watchlist && watchlist !== watchlistToDelete) {
            newListOfWatchlists += watchlist + ',';
        }
    });

    localStorage.setItem(WATCHLISTS_KEY, newListOfWatchlists);

    localStorage.removeItem(watchlistToDelete);

    if (currentWatchlist === watchlistToDelete) {
        resetCurrentWatchlist();
        return DEFAULT_WATCHLIST_NAME;
    }
    return currentWatchlist;
}

export function getCurrentWatchlistContent()
{
    const currentWatchlist = getCurrentWatchlist();
    return getWatchlistContent(currentWatchlist);
}

export function getWatchlistContent(name)
{
    const watchlists = getWatchlistsNames();
    if (!watchlists.includes(name)) return;
    return localStorage.getItem(name).split(',').filter(Boolean);
}

export function setUpLocalStorage()
{
    __createWatchlistsStorage__();
    __createCurrentWatchlistStorage__();
    __createDefaultWatchlist__();
    __createColumnsState__();
}

export function getCurrentWatchlist()
{
    return localStorage.getItem(CURRENT_WATCHLIST_KEY)
}

export function setCurrentWatchlist(name)
{
    localStorage.setItem(CURRENT_WATCHLIST_KEY, name);
}

export function setCurrentWatchlist2(name)
{
    localStorage.setItem(CURRENT_WATCHLIST_KEY, name);
}

export function resetCurrentWatchlist()
{
    localStorage.setItem(CURRENT_WATCHLIST_KEY, DEFAULT_WATCHLIST_NAME);
}

export function setColumnsState(state)
{
    localStorage.setItem(COLUMNS_STATE_KEY, state);
}

export function getColumnsState()
{
    return localStorage.getItem(COLUMNS_STATE_KEY);
}

function __createWatchlistsStorage__()
{
    if (!localStorage.getItem(WATCHLISTS_KEY)) {
        localStorage.setItem(WATCHLISTS_KEY, `${DEFAULT_WATCHLIST_NAME},`)
    }
}

function __createCurrentWatchlistStorage__()
{
    if (!localStorage.getItem(CURRENT_WATCHLIST_KEY)) {
        localStorage.setItem(CURRENT_WATCHLIST_KEY, DEFAULT_WATCHLIST_NAME)
    }
}

function __createColumnsState__()
{
    if (!localStorage.getItem(COLUMNS_STATE_KEY)) {
        localStorage.setItem(COLUMNS_STATE_KEY, JSON.stringify(initialGridState))
    }
}

function __createDefaultWatchlist__()
{
    if (!localStorage.getItem(DEFAULT_WATCHLIST_NAME)) {
        localStorage.setItem(DEFAULT_WATCHLIST_NAME, DEFAULT_WATCHLIST_VALUE)
    }
}
