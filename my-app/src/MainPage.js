import React from "react";
import { Component } from "react";
import Start from "./Start";
import AppPage from "./AppPage"

class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {page : 'Login'}
        this.goAppPage = this.goAppPage.bind(this)
    }
    selectPage(page) {
        if(this.state.page === 'Login')
            return <Start goAppPage={this.goAppPage}/>
        if(this.state.page === 'App') {
            return <AppPage/>
        }
    }
    goAppPage() {
        this.setState({page : 'App'})
    }
    render() {
        return <div>
            {this.selectPage()}
        </div>
    }
}

export default MainPage