import React, {Component} from "react";

export default class BuyOrWriteCellOptionRenderer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a target="_blank" rel="noopener noreferrer">
                {this.props.value}
            </a>
        )
    }
}