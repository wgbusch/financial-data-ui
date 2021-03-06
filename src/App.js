import './App.css';
import React from 'react';
import ParentGrid from "./components/ParentGrid";
import {LocalStorageWrapper} from "./components/LocalStorageWrapper";

class App extends React.Component {

    render() {
        if (typeof (Storage) !== "undefined") {
            const local = new LocalStorageWrapper();
            local.setUp();
        }

        return (
            <ParentGrid/>
        );
    };
}

export default App;
