import './App.css';
import React from 'react';
import ParentGrid from "./Components/ParentGrid/ParentGrid";
import {LocalStorageWrapper} from "./Common/LocalStorageWrapper";

class App extends React.Component {

    setUp() {
        if (typeof (Storage) !== "undefined") {
            const local = new LocalStorageWrapper();
            local.setUp();
        }
    }

    render() {
        this.setUp();
        return (
            <div>
                <ParentGrid/>
            </div>
        );
    };
}

export default App;
