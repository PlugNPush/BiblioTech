import React, {Component} from "react"
import {Link} from "react-router-dom"

class NavBarLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {darkMode: false};
    }

    componentDidMount() {
        // Vérifiez si le mode sombre est préféré par l'utilisateur
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const currentTheme = localStorage.getItem("theme");

        // Appliquez le thème actuel au corps de la page
        if (currentTheme === "dark" || (currentTheme === null && prefersDarkScheme.matches)) {
            console.log("dark mode");
            document.body.classList.add("dark-theme");
            this.setState({ darkMode: true });
        } else {
            console.log("light mode");
            document.body.classList.remove("dark-theme");
            this.setState({ darkMode: false });
        }
    }

    handleDarkMode() {
        // Inversez l'état du mode sombre et mettez à jour le localStorage
        const newDarkMode = !this.state.darkMode;
        const theme = newDarkMode ? "dark" : "light";
        console.log(theme, " mode");
        document.body.classList.toggle("dark-theme", newDarkMode);
        localStorage.setItem("theme", theme);

        this.setState({ darkMode: newDarkMode });
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