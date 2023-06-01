import React from "react"
import { Component } from "react"

import Login from "./Login"
import SignIn from "./SignIn"

import "./Start.scss"

class Start extends Component {
    /**
     * @description first page of the application, the user can choose between login and signin
     * @call in MainPage.js
     */
    constructor(props) {
        super(props)
        this.state = {choice : undefined}
    }
    accueil() {
        if(this.state.choice === undefined) {
            return <div className="accueil">
            <button className="buttonAccueil" onClick={() => this.setState({choice : 'Login'})}>Connexion</button>
            <button className="buttonAccueil" onClick={() => this.setState({choice : 'SignIn'})}>Inscription</button>
            </div>
        } else if(this.state.choice === "Login") {
            return <Login goAppPage={this.props.goAppPage} setEmail={this.props.setEmail}/>
        } else if(this.state.choice === "SignIn") {
            return <SignIn goAppPage={this.props.goAppPage} setEmail={this.props.setEmail}/>
        }
    }
    render() {
        return <React.Fragment>
            {this.accueil()}
        </React.Fragment>
    }
}

export default Start