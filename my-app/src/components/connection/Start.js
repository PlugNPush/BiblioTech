import React, { Component } from "react"

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
        this.state = {choice : 'Login'}
    }
    connexion() {
        return <div className="accueil">
            <div className="buttonContainer">
            <button className={`buttonAccueil ${this.state.choice === "Login" ? "selected" : ""}`} onClick={() => this.setState({choice : 'Login'})}>Connexion</button>
            <button className={`buttonAccueil ${this.state.choice === "SignIn" ? "selected" : ""}`} onClick={() => this.setState({choice : 'SignIn'})}>Inscription</button>
            </div>
            <div className="formContainer">
                {this.state.choice === "Login" ? <Login goAppPage={this.props.goAppPage} setEmail={this.props.setEmail}/> : <SignIn goAppPage={this.props.goAppPage} setEmail={this.props.setEmail}/>}
            </div>
        </div>
    }
    render() {
        return <React.Fragment>
            {this.connexion()}
        </React.Fragment>
    }
}

export default Start