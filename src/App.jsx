import './App.css';
import React from 'react';
import ParentGrid from "./Components/ParentGrid/ParentGrid";
import { setUpLocalStorage} from "./Common/LocalStorageWrapper";

class App extends React.Component {

    setUp() {
        if (typeof (Storage) !== "undefined") {
            setUpLocalStorage();
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
