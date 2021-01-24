import React from "react";
import TradingViewWidget from "react-tradingview-widget";

class Chart extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <TradingViewWidget symbol={this.props.symbol} autosize hideSideToolbar={false}/>
            </div>
        )
    }
}

export default Chart