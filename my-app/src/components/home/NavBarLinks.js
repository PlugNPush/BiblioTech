import React, {Component} from "react"
import {Link} from "react-router-dom"

class NavBarLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {darkMode: false};
    }

    componentDidMount() {
        // Check :root {color-scheme: dark light;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setState({darkMode: true});
        }
    }

    handleDarkMode() {
        // Change :root {color-scheme: dark light;
        /*
        if (this.state.darkMode) {
            document.documentElement.style.colorScheme = "light";
        } else {
            document.documentElement.style.colorScheme = "dark";
        }
        */
        // Change prefers-color-scheme
        if (this.state.darkMode) {
            document.documentElement.style.setProperty('color-scheme', 'light');
        } else {
            document.documentElement.style.setProperty('color-scheme', 'dark');
        }
        this.setState({darkMode: !this.state.darkMode});
    }

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
            <div className="history">
                <Link to="/history">
                    Historique
                </Link>
            </div>
            <div className="user">
                <Link to="/user">
                    Mon compte
                </Link>
            </div>
            <div className="darkMode" onClick={() => this.handleDarkMode()}>
                {this.state.darkMode ? "🌙" : "☀️"}
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