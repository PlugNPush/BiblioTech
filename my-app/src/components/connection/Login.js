import React from "react"
import { Component } from "react"
import axios from "axios"

import "./Form.scss"

class Login extends Component {
    /**
     * @description login page, the user can connect to the application
     * @call in Start.js
     */
    constructor(props) {
        super(props)
        this.state = {email : '', password : '', wrongPassword: false}
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    wrongPassword() {
        if(this.state.wrongPassword) {
            return <div className="wrongPassword">
                Mauvais email/mot de passe
            </div>
        }
    }
    handleSubmit(event) {
        event.preventDefault()
        axios.post("http://localhost:8100/api/login", 
            {email: this.state.email, password: this.state.password})
        .then((res) => {
            if(res.status === 200) {
                this.props.setEmail(this.state.email)
                this.props.goAppPage()
            } else {
                this.setState({wrongPassword : true})
                setTimeout(() => {
                    this.setState({wrongPassword : false})
                }, 3000)
            }
        })
        .catch((res) => {
            this.setState({wrongPassword : true})
            setTimeout(() => {
                this.setState({wrongPassword : false})
            }, 3000)
        })
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
        {this.wrongPassword()}
      </div>
    }
}

export default Login