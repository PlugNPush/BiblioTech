import React from "react";
import { Component } from "react";
import {AiFillHome} from "react-icons/ai"
import {BiHistory} from "react-icons/bi"
import "./NavBar.css"

class NavBar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div className="navbar">
            <div className="homeIcon">
                <AiFillHome onClick={() => {this.props.goHomePage()}}/>
            </div>
            <div className="separatorBar">

            </div>
            <div className="pastIcon">
                <BiHistory onClick={() => {this.props.goHistoricPage()}}/>
            </div>
        </div>
    }
}
export default NavBar