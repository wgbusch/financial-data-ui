import initialGridState from "./initialGridState";

export class LocalStorageWrapper {

    WATCHLISTS_KEY = 'watchlists'
    CURRENT_WATCHLIST_KEY = 'currentWatchlist'
    DEFAULT_WATCHLIST_NAME = 'default';
    INITIAL_WATCHLIST_CONTENT = 'AAPL GOOGL TSLA SPY IWM';
    COLUMNS_STATE_KEY = 'columnsState';

    constructor() {
        this.localStorage = window.localStorage;
    }

    getWatchlistsNames() {
        const watchlists = this.localStorage.getItem(this.WATCHLISTS_KEY)
        const listOfWatchlists = watchlists.split(',')
        let watchlistsNames = []
        listOfWatchlists.forEach(watchlist => {
            let name = watchlist.split(':')[0];
            if (name) {
                watchlistsNames.push(name);
            }
        })
        return watchlistsNames
    }

    addWatchlist(name, content = []) {
        const existingNames = this.getWatchlistsNames();
        if (name && name.match('^[a-zA-Z0-9 ]{1,20}$') && !existingNames.includes(name)) {
            let newWatchlist = name + ':'
            content.forEach(ticker => newWatchlist + ticker + ' ')
            newWatchlist.trimEnd()
            newWatchlist += ','
            this.localStorage.setItem(this.WATCHLISTS_KEY, localStorage.getItem('watchlists') + newWatchlist)
        }
    }

    updateWatchlist(watchlistName, symbol) {
        const watchlists = this.localStorage.getItem(this.WATCHLISTS_KEY);
        const listOfWatchlists = watchlists.split(',');
        let watchlistContent = [];
        listOfWatchlists.forEach(watchlist => {
            let currentName = watchlist.split(':')[0];
            if (currentName === watchlistName) {
                watchlistContent = watchlist.split(':')[1].split(' ');
                this.localStorage.setItem(this.CURRENT_WATCHLIST_KEY, `${watchlistContent} ${symbol}`);
            }

            // if (currentName === name) {
            //     watchlistContent = watchlist.split(':')[1].split(' ');
            // }
        })
        return watchlistContent;
    }

    deleteWatchlist(name) {
        if (name === this.DEFAULT_WATCHLIST_NAME) {
            return -1;
        }
        const watchlists = this.localStorage.getItem(this.WATCHLISTS_KEY).split(',');

        const currentWatchlist = this.getCurrentWatchlist();
        let newWatchlist = '';
        watchlists.forEach(watchlist => {
            let currentName = watchlist.split(':')[0];
            if (currentName && currentName !== name) {
                newWatchlist += watchlist + ',';
            }
        });
        this.localStorage.setItem(this.WATCHLISTS_KEY, newWatchlist);
        if (currentWatchlist === name) {
            this.resetCurrentWatchlist();
            return this.DEFAULT_WATCHLIST_NAME;
        } else {
            return currentWatchlist;
        }
    }

    getWatchlistContent(name) {
        const watchlists = this.localStorage.getItem(this.WATCHLISTS_KEY)
        const listOfWatchlists = watchlists.split(',')
        let watchlistContent = [];
        listOfWatchlists.forEach(watchlist => {
            let currentName = watchlist.split(':')[0];
            if (currentName === name) {
                watchlistContent = watchlist.split(':')[1].split(' ');
            }
        })
        return watchlistContent
    }

    setUp() {
        this.__createWatchlistsStorage__();
        this.__createCurrentWatchlistStorage__();
        this.__createColumnsState__();
    }

    getCurrentWatchlist() {
        return this.localStorage.getItem(this.CURRENT_WATCHLIST_KEY)
    }

    setCurrentWatchlist(name) {
        this.localStorage.setItem(this.CURRENT_WATCHLIST_KEY, name);
    }

    resetCurrentWatchlist() {
        this.localStorage.setItem(this.CURRENT_WATCHLIST_KEY, this.DEFAULT_WATCHLIST_NAME);
    }

    setColumnsState(state) {
        this.localStorage.setItem(this.COLUMNS_STATE_KEY, state);

    }

    getColumnsState() {
        return this.localStorage.getItem(this.COLUMNS_STATE_KEY);
    }

    __createWatchlistsStorage__() {
        if (!this.localStorage.getItem(this.WATCHLISTS_KEY)) {
            this.localStorage.setItem(this.WATCHLISTS_KEY, this.DEFAULT_WATCHLIST_NAME + ':' + this.INITIAL_WATCHLIST_CONTENT + ',')
        }
    }

    __createCurrentWatchlistStorage__() {
        if (!this.localStorage.getItem(this.CURRENT_WATCHLIST_KEY)) {
            this.localStorage.setItem(this.CURRENT_WATCHLIST_KEY, this.DEFAULT_WATCHLIST_NAME)
        }
    }

    __createColumnsState__() {
        if (!this.localStorage.getItem(this.COLUMNS_STATE_KEY)) {
            this.localStorage.setItem(this.COLUMNS_STATE_KEY, JSON.stringify(initialGridState))
        }
    }
}