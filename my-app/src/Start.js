import React from "react";
import { Component } from "react";
import Login from "./Login";
import SignIn from "./SignIn";
import "./Start.css"

class Start extends Component {
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
            return <Login/>
        } else if(this.state.choice === "SignIn") {
            return <SignIn/>
        } else {
            return <Login/>
        }
    }
    choosePage(page) {
        if(page === "Login") {
            return <Login/>
        }
        if(page === "SignIn") {
            return <SignIn/>
        }
    }
    render() {
        return <div>
            {this.accueil()}
        </div>
    }
}
export default Start