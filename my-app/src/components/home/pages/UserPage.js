import React, {Component} from 'react'

import NavBar from '../NavBar'

import './UserPage.scss'

class UserPage extends Component {
    /**
     * @description the user page, here the user can see his informations, change his password, etc. and delete his account
     * @call in App.js
     */
    render() {
        return <React.Fragment>
            <NavBar/>
            <div className="userPage">
                <h1>Page utilisateur</h1>
                <p>En cours de développement</p>
            </div>
        </React.Fragment>
    }
}

export default UserPage