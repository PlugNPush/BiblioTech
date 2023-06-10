import React, {Component} from "react"
import {BiHistory} from "react-icons/bi"
import {ImExit} from "react-icons/im"

import PopUpExit from "components/popUp/PopUpExit"
import "./NavBar.scss"
import logo from "assets/logo.png"
import {Link} from "react-router-dom";

class NavBar extends Component {
    /**
     * @description the navigation bar
     * @call in AppPage.js
     */
    constructor(props) {
        super(props);
        this.state = {popup: false}
        this.setPopup = this.setPopup.bind(this)
    }
    setPopup() {
        this.setState({popup: !this.state.popup})
    }
    showPopup() {
        if(this.state.popup) {
            return <PopUpExit setPopup={this.setPopup}/>
        }
    }
    render() {
        return <div className="navbar">
            <div className="logoApp">
                <Link to="/home">
                    <img src={logo} alt="Logo" className="non-selectable"/>
                </Link>
            </div>
            <div className="pastIcon">
                <Link to="/historic">
                    <BiHistory size={90}/>
                </Link>
            </div>
            <div className="exitIcon">
                <ImExit onClick={() => this.setState({popup: true})} />
            </div>
            {this.showPopup()}
        </div>
    }
}

export default NavBar