import initialGridState from "./initialGridState";

export class LocalStorageWrapper {

    WATCHLISTS_KEY = 'watchlists'
    CURRENT_WATCHLIST_KEY = 'currentWatchlist'
    DEFAULT_WATCHLIST_NAME = 'default';
    DEFAULT_WATCHLIST_VALUE = 'AAPL,GOOGL,TSLA,SPY,IWM';
    COLUMNS_STATE_KEY = 'columnsState';

    constructor() {
        this.localStorage = window.localStorage;
    }

    getWatchlistsNames() {
        const watchlists = this.localStorage.getItem(this.WATCHLISTS_KEY)
        return watchlists.split(',').filter(Boolean);
    }

    addWatchlist(name) {
        const existingNames = this.getWatchlistsNames();
        if (name && name.match('^[a-zA-Z0-9 ]{1,20}$') && !existingNames.includes(name)) {
            if (this.localStorage.getItem(name)) return
            this.localStorage.setItem(name, '')
            const watchlists = this.localStorage.getItem(this.WATCHLISTS_KEY)
            this.localStorage.setItem(this.WATCHLISTS_KEY, `${watchlists}${name},`)
        }
    }

    updateCurrentWatchlist(symbol) {
        const currentWatchlist = this.getCurrentWatchlist();
        const content = this.localStorage.getItem(currentWatchlist);
        const newContent = content ? `${content},${symbol}` : symbol;
        this.localStorage.setItem(currentWatchlist, newContent);
        return newContent.split(',').filter(Boolean);
    }

    deleteWatchlist(watchlistToDelete) {
        if (!watchlistToDelete || watchlistToDelete === this.DEFAULT_WATCHLIST_NAME) return -1;

        const currentWatchlist = this.getCurrentWatchlist();
        let newListOfWatchlists = '';
        const watchlists = this.getWatchlistsNames();
        watchlists.forEach(watchlist => {
            if (watchlist && watchlist !== watchlistToDelete) {
                newListOfWatchlists += watchlist + ',';
            }
        });

        this.localStorage.setItem(this.WATCHLISTS_KEY, newListOfWatchlists);

        this.localStorage.removeItem(watchlistToDelete);

        if (currentWatchlist === watchlistToDelete) {
            this.resetCurrentWatchlist();
            return this.DEFAULT_WATCHLIST_NAME;
        }
        return currentWatchlist;
    }

    getWatchlistContent(name) {
        const watchlists = this.getWatchlistsNames();
        if (!watchlists.includes(name)) return;
        return this.localStorage.getItem(name).split(',').filter(Boolean);
    }

    setUp() {
        this.__createWatchlistsStorage__();
        this.__createCurrentWatchlistStorage__();
        this.__createDefaultWatchlist__();
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
            this.localStorage.setItem(this.WATCHLISTS_KEY, `${this.DEFAULT_WATCHLIST_NAME},`)
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

    __createDefaultWatchlist__() {
        this.localStorage.setItem(this.DEFAULT_WATCHLIST_NAME, this.DEFAULT_WATCHLIST_VALUE);
    }
}