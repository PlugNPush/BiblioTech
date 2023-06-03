import React from "react"
import { Component } from "react"
import {BiHistory} from "react-icons/bi"
import {ImExit} from "react-icons/im"

import "./NavBar.scss"
import logo from "assets/logo.png"

class NavBar extends Component {
    /**
     * @description the navigation bar
     * @call in AppPage.js
     */
    constructor(props) {
        super(props)
    }
    render() {
        return <div className="navbar">
            <div className="logoApp">
                <img src={logo} alt="Logo" className="non-selectable" onClick={() => {this.props.goHomePage()}}/>
            </div>
            <div className="pastIcon">
                <BiHistory onClick={() => {this.props.goHistoricPage()}}/>
            </div>
            <div className="exitIcon">
                <ImExit onClick={() => {this.props.logOut()}}/>
            </div>
        </div>
    }
}

export default NavBar