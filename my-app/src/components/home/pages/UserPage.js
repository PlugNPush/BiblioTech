import React, {Component} from 'react'
import axios from 'axios'

import NavBar from '../NavBar'

import './UserPage.scss'

class UserPage extends Component {
    /**
     * @description the user page, here the user can see his informations, change his password, etc. and delete his account
     * @call in App.js
     */
    constructor(props) {
        super(props);
        this.state = {user: {}, newuser: {password:"",firstname:"",lastname:""}, message: ""}
    }
    getUserInfos() { // récupérer les infos de l'utilisateur
        axios.get("http://localhost:8100/api/getuser/" + localStorage.getItem("email"))
        .then((res) => {
            this.setState({user: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }
    message() {
        if (this.state.message !== "") {
            return <p>{this.state.message}</p>
        }
    }
    resetUser() { // reset les infos de l'utilisateur
        this.setState({newuser: {password: "", firstname: "", lastname: ""}})
    }
    updateUser() { // update les infos de l'utilisateur
        if (this.state.newuser.password === "" && this.state.newuser.firstname === "" && this.state.newuser.lastname === "") {
            this.setState({message: "Aucun changement n'a été effectué"})
            return
        }
        axios.put("http://localhost:8100/api/updateuser/" + localStorage.getItem("email"), this.state.newuser)
        .then((res) => {
            this.setState({message: res.data.message})
            // give this.state.newuser.firstname if it's not null, else give this.state.user.firstname, same for lastname
            this.setState({user: {firstname: this.state.newuser.firstname || this.state.user.firstname, lastname: this.state.newuser.lastname || this.state.user.lastname, email: localStorage.getItem("email")}})
            this.resetUser()
        })
        .catch((err) => {
            console.log(err)
        })
    }
    deleteUser() { // supprimer l'utilisateur
        axios.delete("http://localhost:8100/api/deleteuser/" + localStorage.getItem("email"))
        .then((res) => {
            localStorage.setItem("email", "")
            window.location.href = "/"
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.getUserInfos()
    }
    render() {
        return <React.Fragment>
            <NavBar/>
            <div className="userPage">
                <h1>Page utilisateur</h1>
                <div className="userInfos">
                    <p>Adresse mail : {this.state.user.email}</p>
                    <p>Mot de passe :
                        <input type="password" placeholder='***********' value={this.state.newuser.password} onChange={(e) => {this.setState({newuser: {password: e.target.value, firstname: this.state.newuser.firstname, lastname: this.state.newuser.lastname}})}}/>
                    </p>
                    <p>Prénom :
                        <input type="text" placeholder={this.state.user.firstname} value={this.state.newuser.firstname} onChange={(e) => {this.setState({newuser: {password: this.state.newuser.password, firstname: e.target.value, lastname: this.state.newuser.lastname}})}}/>
                    </p>
                    <p>Nom :
                        <input type="text" placeholder={this.state.user.lastname} value={this.state.newuser.lastname} onChange={(e) => {this.setState({newuser: {password: this.state.newuser.password, firstname: this.state.newuser.firstname, lastname: e.target.value}})}}/>
                    </p>
                </div>
                <div className="userActions">
                    <button onClick={() => this.resetUser()}>Réinitialiser</button>
                    <button onClick={() => this.updateUser()}>Mettre à jour</button>
                    <button onClick={() => this.deleteUser()}>Supprimer</button>
                </div>
                {this.message()}
            </div>
        </React.Fragment>
    }
}

export default UserPage