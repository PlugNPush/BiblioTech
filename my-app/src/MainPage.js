import React from "react";
import { Component } from "react";
import Start from "./Start";
import AppPage from "./AppPage"

class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {page : 'Login', email:""}
        this.goAppPage = this.goAppPage.bind(this)
        this.setEmail = this.setEmail.bind(this)
    }
    setEmail(userEmail) {
        this.setState({email: userEmail})
    }
    selectPage(page) {
        if(this.state.page === 'Login')
            return <Start goAppPage={this.goAppPage} setEmail={this.setEmail}/>
        if(this.state.page === 'App') {
            return <AppPage getEmail={this.state.email}/>
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