import './App.css';
import React from 'react';
import ParentGrid from "./components/ParentGrid";
import {LocalStorageWrapper} from "./components/LocalStorageWrapper";

class App extends React.Component {

    setUp(){
        if (typeof (Storage) !== "undefined") {
            const local = new LocalStorageWrapper();
            local.setUp();
        }
    }

    render() {
        this.setUp();
        return (
            <ParentGrid/>
        );
    };
}

export default App;
