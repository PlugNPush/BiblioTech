import React, {Component} from "react"
import "./NavBar.scss"
import {Link} from "react-router-dom";

class NavBar extends Component {
    /**
     * @description the navigation bar
     * @call in every page
     */
    constructor(props) {
        super(props);
        this.state = {popup: false}
        this.setPopup = this.setPopup.bind(this)
    }
    setPopup() {
        this.setState({popup: !this.state.popup})
    }
    render() {
        if (localStorage.getItem("email") === "") {
            window.location.href = "/"
        }
        return <div className="navbar">
            <div className="logoApp">
                <Link to="/home">
                    Accueil
                </Link>
            </div>
            <div className="searchIcon">
                <Link to="/search">
                    Rechercher
                </Link>
            </div>
            <div className="reccoIcon">
                <Link to="/reccomandation">
                    Recommandation
                </Link>
            </div>
            <div className="position">
                <Link to={"/position"}>
                    Boîtes à livres
                </Link>
            </div>
            <div className="pastIcon">
                <Link to="/historic">
                    Historique
                </Link>
            </div>
            <div className="userIcon">
                <Link to="/user">
                    Mon compte
                </Link>
            </div>
            <div className="exitIcon" onClick={() => {
                localStorage.setItem("email", "");
                window.location.href = "/"}
            }>
                Se déconnecter
            </div>
        </div>
    }
}

export default NavBar