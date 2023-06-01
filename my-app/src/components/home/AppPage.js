import React from "react"
import { Component } from "react"

import NavBar from "./NavBar"
import Home from "./pages/Home"
import HistoricPage from "./pages/HistoricPage"

import "./AppPage.scss"

class AppPage extends Component {
    /**
     * @description define navbar and pages
     * @call in MainPage.js
     */
    constructor(props) {
        super(props)
        this.state = {page : "home"}
        this.goHomePage = this.goHomePage.bind(this)
        this.goHistoricPage = this.goHistoricPage.bind(this)
        this.logOut = this.logOut.bind(this)
        this.selectPage = this.selectPage.bind(this)
    }
    goHomePage() {
        this.setState({page : "home"})
    }
    goHistoricPage() {
        this.setState({page : "historic"})
    }
    logOut() {
        window.location.reload()
    }
    selectPage() {
        if(this.state.page === "home") {
            return <Home getEmail={this.props.getEmail}/>
        }
        if(this.state.page === "historic") {
            return <HistoricPage getEmail={this.props.getEmail}/>
        }
    }
    render() {
        return <div className="appPage">
            <NavBar goHomePage={this.goHomePage} goHistoricPage={this.goHistoricPage} logOut={this.logOut}/>
            <div className="choosePageSite">
                {this.selectPage()}
            </div>
        </div>
    }
}

export default AppPage