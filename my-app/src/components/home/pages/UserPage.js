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
        axios.get("http://localhost:8100/api/getuser/" + window.email)
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
        axios.put("http://localhost:8100/api/updateuser/" + window.email,
        {password: this.state.newuser.password??"", firstname: this.state.newuser.firstname??this.state.user.firstname, lastname: this.state.newuser.lastname??this.state.user.lastname})
        .then((res) => {
            this.setState({message: res.data.message})
            this.setState({user: this.state.newuser})
            this.getUserInfos()
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
                    <button onClick={() => this.resetUser()}>Reset</button>
                    <button onClick={() => this.updateUser()}>Update</button>
                    <button onClick={() => this.deleteUser()}>Delete</button>
                </div>
                {this.message()}
            </div>
        </React.Fragment>
    }
}

export default UserPage