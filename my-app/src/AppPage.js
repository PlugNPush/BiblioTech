import React from "react";
import { Component } from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import "./AppPage.css"

class AppPage extends Component {
    render() {
        return <div className="appPage">
            <div>Logo App A mettre
                <NavBar/>
            </div>
            <div>
                <Home/>
            </div>
        </div>
    }
}
export default AppPage