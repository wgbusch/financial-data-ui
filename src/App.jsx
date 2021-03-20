import './App.css';
import React from 'react';
import ParentGrid from "./Components/ParentGrid";
import {LocalStorageWrapper} from "./Common/LocalStorageWrapper";
import {toast, ToastContainer} from "react-toastify";
import {Button} from "antd";
import ToastCard from "./Components/ToastCard";

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
                <ToastCard/>
            </div>
        );
    };
}

export default App;
