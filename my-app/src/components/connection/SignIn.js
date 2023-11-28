import React, {useState} from "react"
import axios from 'axios'

import "./Form.scss"
import {useNavigate} from "react-router-dom";

function SignIn(props) {
    /**
     * @description form to sign in
     * @call in Start.js
     */
    const [wrongEmail, setWrongEmail] = useState(false)
    const navigate = useNavigate();
    function badEmail() {
        if({wrongEmail}.wrongEmail === true) {
            return <div className="wrongPassword">
                Email déjà pris
            </div>
        }
    }
    function handleSubmit(event) {
        event.preventDefault()
        axios.post("http://localhost:8100/api/signin", 
            {firstname: event.target.elements.firstName.value,
                lastname: event.target.elements.lastName.value,
                email: event.target.elements.email.value,
                password: event.target.elements.password.value})
        .then((res) => {
            if(res.status === 200) {
                localStorage.setItem("email", event.target.elements.email.value)
                navigate("/home")
            } else {
                setWrongEmail(true)
                setTimeout(() => {
                    setWrongEmail(false)
                }, 3000)
            }
        })
        .catch((res) => {
            setWrongEmail(true)
            setTimeout(() => {
                setWrongEmail(false)
            }, 3000)
        })
    }
    return <React.Fragment>
        <form className="formCss" onSubmit={handleSubmit}>
            <label>
                Prénom:
            <input className="inputForm" type="text" name="firstName" />
            </label>
            <label>
            Nom de Famille:
            <input className="inputForm" type="text" name="lastName"/>
            </label>
            <label>
            Email:
            <input className="inputForm" type="email" name="email"/>
            </label>
            <label>
            Mot de passe:
            <input className="inputForm" type="password" name="password"/>
            </label>
            <button className="submit" type="submit">S'inscrire</button>
        </form>
        {badEmail()}
    </React.Fragment>
}

export default SignIn