import React from "react";
import { Component } from "react";
import "./Form.css"

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {firstName : '', lastName : '', email : '', password : ''}
    }
    handleSubmit(event) {
        event.preventDefault()
        //appel à la bdd
    }
    render() {
        return <div>
        <form className="formCss" onSubmit={this.handleSubmit}>
            <label>
            Email:
            <input className="inputForm" type="email" name="email" onChange={e => this.setState({email : e.target.value})} />
            </label>
            <label>
            Password:
            <input className="inputForm" type="password" name="password" onChange={e => this.setState({password : e.target.value})} />
            </label>
            <button className="submit" type="submit">Sign Up</button>
        </form>
      </div>
    }
}
export default Login