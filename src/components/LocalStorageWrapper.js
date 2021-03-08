export class LocalStorageWrapper {

    WATCHLISTS = 'watchlists'
    CURRENT_WATCHLIST = 'currentWatchlist'

    constructor() {
    }

    getWatchlistsNames() {
        const localStorage = window.localStorage;
        if (!localStorage.getItem(this.WATCHLISTS)) {
            localStorage.setItem(this.WATCHLISTS, 'default:\'AAPL\' \'GOOGL\' \'TSLA\' \'SPY\' \'IWM\',')
        }
        const watchlists = localStorage.getItem(this.WATCHLISTS)
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

    getCurrentWatchlist() {
        const localStorage = window.localStorage;

        if (!localStorage.getItem(this.CURRENT_WATCHLIST)) {
            this.resetCurrentWatchlist();
        }
        return localStorage.getItem(this.CURRENT_WATCHLIST)
    }

    addWatchlist(name, content = []) {
        const localStorage = window.localStorage;
        if (!localStorage.getItem(this.WATCHLISTS)) {
            localStorage.setItem(this.WATCHLISTS, 'default:\'AAPL\' \'GOOGL\' \'TSLA\' \'SPY\' \'IWM\',')
        }

        const existingNames = this.getWatchlistsNames();
        if (name && name.match('^[a-zA-Z0-9 ]{1,20}$') && !existingNames.includes(name)) {
            let newWatchlist = name + ':'
            content.forEach(ticker => newWatchlist + '\'' + ticker + '\' ')
            newWatchlist.trimEnd()
            newWatchlist += ','
            localStorage.setItem(this.WATCHLISTS, localStorage.getItem('watchlists') + newWatchlist)
        }
    }

    getWatchlistContent(name) {
        const localStorage = window.localStorage;
        const watchlists = localStorage.getItem(this.WATCHLISTS)
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
        const localStorage = window.localStorage;
        if (!localStorage.getItem(this.WATCHLISTS)) {
            localStorage.setItem(this.WATCHLISTS, 'default:\'AAPL\' \'GOOGL\' \'TSLA\' \'SPY\' \'IWM\',')
        }
        if (!localStorage.getItem(this.CURRENT_WATCHLIST)) {
            localStorage.setItem(this.CURRENT_WATCHLIST, 'default')
        }
    }

    resetCurrentWatchlist() {
        const localStorage = window.localStorage;
        localStorage.setItem(this.CURRENT_WATCHLIST, 'default');
        if (!localStorage.getItem(this.WATCHLISTS)) {
            localStorage.setItem(this.WATCHLISTS, 'default:\'AAPL\' \'GOOGL\' \'TSLA\' \'SPY\' \'IWM\',')
        }
    }

    deleteWatchlist(name) {
        const localStorage = window.localStorage;
        const watchlists = localStorage.getItem(this.WATCHLISTS).split(',');

        const currentWatchlist = this.getCurrentWatchlist();
        let newWatchlist = '';
        watchlists.forEach(watchlist => {
            let currentName = watchlist.split(':')[0];
            if (currentName && currentName !== name) {
                newWatchlist += watchlist + ',';
            }
        });
        localStorage.setItem(this.WATCHLISTS, newWatchlist);
        if (currentWatchlist === name) {
            this.resetCurrentWatchlist();
            return 'default';
        } else{
            return currentWatchlist;
        }
    }

    setCurrentWatchlist(name) {
        const localStorage = window.localStorage;
        localStorage.setItem(this.CURRENT_WATCHLIST, name);
    }
}