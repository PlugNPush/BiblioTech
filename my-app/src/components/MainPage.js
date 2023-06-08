import React, { Component } from "react"

import Start from "./connection/Start"
import AppPage from "./home/AppPage"

class MainPage extends Component {
    /**
     * @description select the page to display between the login page and the application page
     * @call in App.js
     */
    constructor(props) {
        super(props)
        this.state = {page : 'Login', email:""}
        this.goAppPage = this.goAppPage.bind(this)
        this.setEmail = this.setEmail.bind(this)
    }
    setEmail(userEmail) {
        this.setState({email: userEmail});
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
        return <React.Fragment>
            {this.selectPage()}
        </React.Fragment>
    }
}

export default MainPage