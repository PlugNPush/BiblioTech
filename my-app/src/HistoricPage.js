import React from "react";
import { Component } from "react";
import "./HistoricPage.css"
import Book from "./Book";

class HistoricPage extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div className="historicPage">
            <div className="titreHistoricPage">
                Liste des Livres scannés :
            </div>
            <div className="listeLivres">
                <Book title={"Ice of Song and Fire"} author={"George R.R. Martin"} year={"1996"}/>
            </div>
        </div>
    }
}

export default HistoricPage