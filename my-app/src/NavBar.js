import React from "react";
import { Component } from "react";
import {AiFillHome} from "react-icons/ai"
import {BiHistory} from "react-icons/bi"
import "./NavBar.css"

class NavBar extends Component {
    render() {
        return <div className="navbar">
            <div className="homeIcon">
                <AiFillHome/>
            </div>
            <div className="separatorBar">

            </div>
            <div className="pastIcon">
                <BiHistory/>
            </div>
        </div>
    }
}
export default NavBar