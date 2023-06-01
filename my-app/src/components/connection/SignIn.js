import React from "react"
import { Component } from "react"
import axios from 'axios'

import "./Form.scss"

class SignIn extends Component {
    /**
     * @description form to sign in
     * @call in Start.js
     */
    constructor(props) {
        super(props)
        this.state = {firstName : '', lastName : '', email : '', password : '', badEmail : false}
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    badEmail() {
        if(this.state.badEmail) {
            return <div className="wrongPassword">
                Email déjà pris
            </div>
        }
    }
    handleSubmit(event) {
        event.preventDefault()
        axios.post("http://localhost:8100/api/signin", 
            {firstname: this.state.firstName, lastname: this.state.lastName, email: this.state.email, password: this.state.password})
        .then((res) => {
            if(res.status === 200) {
                this.props.setEmail(this.state.email)
                this.props.goAppPage()
            } else {
                this.setState({badEmail : true})
                setTimeout(() => {
                    this.setState({badEmail : false})
                }, 3000)
            }
        })
        .catch((res) => {
            this.setState({badEmail : true})
            setTimeout(() => {
                this.setState({badEmail : false})
            }, 3000)
        })
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
        {this.badEmail()}
      </div>
    }
}

export default SignIn