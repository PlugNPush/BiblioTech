import React from "react";
import { Component } from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import "./AppPage.css"
import HistoricPage from "./HistoricPage";

class AppPage extends Component {
    constructor(props) {
        super(props)
        this.state = {page : "home"}
        this.goHomePage = this.goHomePage.bind(this)
        this.goHistoricPage = this.goHistoricPage.bind(this)
        this.selectPage = this.selectPage.bind(this)
    }
    goHomePage() {
        this.setState({page : "home"})
    }
    goHistoricPage() {
        this.setState({page : "historic"})
    }
    selectPage() {
        if(this.state.page === "home") {
            return <Home/>
        }
        if(this.state.page === "historic") {
            return <HistoricPage/>
        }
    }
    render() {
        return <div className="appPage">
            <div>Logo App A mettre
                <NavBar goHomePage={this.goHomePage} goHistoricPage={this.goHistoricPage}/>
            </div>
            <div>
                {this.selectPage()}
            </div>
        </div>
    }
}
export default AppPage