import React, {Component} from "react"
import {Link} from "react-router-dom"

class NavBarLinks extends Component {

    render() {
        return <React.Fragment>
            <div className="home">
                <Link to="/home">
                    Accueil
                </Link>
            </div>
            <div className="search">
                <Link to="/search">
                    Rechercher
                </Link>
            </div>
            <div className="reccomandation">
                <Link to="/reccomandation">
                    Recommandation
                </Link>
            </div>
            <div className="position">
                <Link to={"/position"}>
                    Boîtes à livres
                </Link>
            </div>
            <div className="historic">
                <Link to="/historic">
                    Historique
                </Link>
            </div>
            <div className="user">
                <Link to="/user">
                    Mon compte
                </Link>
            </div>
            <div className="exit" onClick={() => {
                localStorage.setItem("email", "");
                window.location.href = "/"}
            }>
                Se déconnecter
            </div>
        </React.Fragment>
    }
}

export default NavBarLinks