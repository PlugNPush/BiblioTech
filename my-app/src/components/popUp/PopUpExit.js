import React, { Component } from "react"

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
            <div className="greyScreen" onClick={() => {this.handleCancelExit();}}>
                <div className="confirmation-box exitPopUp" onClick={(e) => {e.stopPropagation();}}>
                    <p>Voulez vous quitter ?</p>
                    <div className="centered">
                        <button onClick={() => { this.handleConfirmExit(); }}>Yes</button>
                        <button onClick={() => { this.handleCancelExit(); }}>No</button>
                    </div>
                </div>
            </div>
        )}</React.Fragment>
    }
}

export default PopUpExit