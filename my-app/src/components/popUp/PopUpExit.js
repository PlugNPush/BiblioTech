import React from "react"
import { Component } from "react"

import "components/home/NavBar.scss"

class PopUpExit extends Component {
    /**
     * @description base of the pop ups
     * @call in MainPage.js
     */
    constructor(props) {
        super(props);
        this.state = {
            showConfirmationBox: false
        }
    }

    confirmExit() {
        this.setState({ showConfirmationBox: true });
    }

    handleConfirmExit() {
        window.location.reload();
    }
    handleCancelExit() {
        this.setState({ showConfirmationBox: false });
    }

    render() {
        return <React.Fragment>{this.state.showConfirmationBox && (
            <div className="confirmation-box exitPopUp">
                <p>Do you really want to exit?</p>
                <button onClick={() => { this.handleConfirmExit(); }}>Yes</button>
                <button onClick={() => { this.handleCancelExit(); }}>No</button>
            </div>
        )}</React.Fragment>
    }
}

export default PopUpExit