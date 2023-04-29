import React from "react";
import { Component } from "react";
import {AiFillHome} from "react-icons/ai"
import {BiHistory} from "react-icons/bi"
import {ImExit} from "react-icons/im"
import "./NavBar.css"

class NavBar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div className="navbar">
            <div className="logoApp">
                Logo
            </div>
            <div className="homeIcon">
                <AiFillHome onClick={() => {this.props.goHomePage()}}/>
            </div>
            <div className="separatorBar">

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