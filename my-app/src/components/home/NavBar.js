import React, {Component} from "react"
import {Link} from "react-router-dom"

import NavBarLinks from "./NavBarLinks"

import "./NavBar.scss"
import logo from "assets/logo.png"
import {FaBars} from "react-icons/fa"
import {IoIosArrowUp, IoIosArrowDown} from "react-icons/io" // import an icon in form of '^' to reduce the navbar and 'v' to expand the navbar

class NavBar extends Component {
    /**
     * @description the navigation bar
     * @call in every page
     */
    constructor(props) {
        super(props);
        this.state = {popup: false, expanded: false, reduced: false}
        this.setPopup = this.setPopup.bind(this)
        this.expand = this.expand.bind(this)
        this.reduce = this.reduce.bind(this)
    }
    setPopup() {
        this.setState({popup: !this.state.popup})
    }
    expand() {
        this.setState({expanded: !this.state.expanded})
    }
    reduce() {
        console.log("reduce", this.state.reduced)
        this.setState({reduced: !this.state.reduced})
    }
    render() {
        if (localStorage.getItem("email") === "") {
            window.location.href = "/"
        }
        return <div className={`navbar ${this.state.expanded ? 'expanded' : ''} ${this.state.reduced ? 'reduced' : ''}`}>
            <div className="bar">
                <div className="logo">
                    <Link to="/home">
                        <img src={logo} alt="logo"/>
                    </Link>
                </div>
                {this.state.expanded ?
                null:<NavBarLinks/>}
                <div className="expandIcon" onClick={this.expand}>
                    <FaBars/>
                </div>
            </div>
            {this.state.expanded ? <NavBarLinks/> : null}
            <button className="reduceButton" onClick={this.reduce}>
                {this.state.reduced ? <React.Fragment>
                    <IoIosArrowDown/><IoIosArrowDown/><IoIosArrowDown/>
                </React.Fragment> : <React.Fragment>
                    <IoIosArrowUp/><IoIosArrowUp/><IoIosArrowUp/>
                </React.Fragment>}
            </button>
        </div>
    }
}

export default NavBar