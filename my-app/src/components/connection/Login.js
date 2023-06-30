import React, {useState} from "react"
import axios from "axios"

import "./Form.scss"
import {useNavigate} from "react-router-dom";

function Login(props) {
    /**
     * @description login page, the user can connect to the application
     * @call in Start.js
     */
    const [wrongPassword, setWrongPassword] = useState(false)
    const navigate = useNavigate();
    function showWrongPassword() {
        if({wrongPassword}.wrongPassword) {
            return <div className="wrongPassword">
                Mauvais email/mot de passe
            </div>
        }
    }
    function handleSubmit(event) {
        event.preventDefault()
        axios.post("http://localhost:8100/api/login", 
            {email: event.target.elements.email.value, password: event.target.elements.password.value})
        .then((res) => {
            if(res.status === 200) {
                localStorage.setItem("email", event.target.elements.email.value)
                navigate("/home")
            } else {
                setWrongPassword(true)
                setTimeout(() => {
                    setWrongPassword(false)
                }, 3000)
            }
        })
        .catch((res) => {
            setWrongPassword(true)
            setTimeout(() => {
                setWrongPassword(false)
            }, 3000)
        })
    }
        return <React.Fragment>
        <form className="formCss" onSubmit={handleSubmit}>
            <label>
            Email:
            <input className="inputForm" type="email" name="email"/>
            </label>
            <label>
            Password:
            <input className="inputForm" type="password" name="password"/>
            </label>
            <button className="submit" type="submit">Sign Up</button>
        </form>
        {showWrongPassword()}
      </React.Fragment>

}

export default Login