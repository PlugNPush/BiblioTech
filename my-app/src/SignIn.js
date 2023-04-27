import React from "react";
import { Component } from "react";
import "./Form.css"

class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {firstName : '', lastName : '', email : '', password : ''}
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(event) {
        event.preventDefault()
        this.props.goAppPage()
        //appel à la bdd
    }
    render() {
        return <div>
        <form className="formCss" onSubmit={this.handleSubmit}>
            <label>
            First Name:
            <input className="inputForm" type="text" name="firstName" onChange={e => this.setState({firstName : e.target.value})} />
            </label>
            <label>
            Last Name:
            <input className="inputForm" type="text" name="lastName" onChange={e => this.setState({lastName : e.target.value})} />
            </label>
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
export default SignIn