import React from "react"
import { Component } from "react"

import PopUpExit from "./PopUpExit"

class PopUp extends Component {
    /**
     * @description base of the pop ups
     * @call in MainPage.js
     */
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="popup">
            <PopUpExit/>
        </div>
    }
}

export default PopUp