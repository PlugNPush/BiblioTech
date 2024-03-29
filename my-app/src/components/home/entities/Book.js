import axios from "axios"
import React, { Component } from "react"

import {addBook, noteBook} from "utils/sendBook" // noteBook(title, owner, note)

import {AiTwotoneDelete, AiFillCheckCircle} from "react-icons/ai"
import {TiStarFullOutline, TiStarHalfOutline, TiStarOutline} from "react-icons/ti"

import "./Book.scss"

class Book extends Component {
    /**
     * @description display a book
     * @call in HistoryPage.js
     */
    constructor(props) {
        super(props)
        this.state = { note: this.props.note, initNote: this.props.note }
        this.stars = React.createRef()
    }
    deleteBook() {
        axios.post("http://localhost:8100/api/deletebook", {owner: localStorage.getItem("email"), title: this.props.title})
        .then((res) => {
            this.props.whenDelete()
        }).catch((err) => {
            console.log(err)
        })
    }
    
    addBookFromRecco() {
        addBook(this.props.title, localStorage.getItem("email"), this.props.author, this.props.year, this.props.type, this.props.publisher)
        axios.post("http://localhost:8100/api/deleterecco", {
            email: localStorage.getItem("email"),
            title: this.props.title
        }).then((res) => {
            this.props.whenAdded()
        }).catch((err) => {
            console.log(err)
        })
    }
    changeRating(e) {
        const divElement = this.stars.current // Accéder à la référence de la div
        const container = divElement.getBoundingClientRect() // Obtenir les coordonnées de la div
        const mouseX = e.clientX - container.left // Calculer la position X relative à la div
        const positionX = mouseX / container.width // Normaliser la position X entre 0 et 1
        const note = Math.round(positionX * 10) / 2 // Transformer en plage de 0 à 5 par incréments de 0.5
        // changer l'affichage des étoiles
        this.setState({ note: note })
    }

    calculateRating(note) {
        let stars = []
        for (let i = 0; i < 5; i++) {
            if (note >= i + 1) {
                stars.push(<TiStarFullOutline/>)
            } else if (note >= i + 0.5) {
                stars.push(<TiStarHalfOutline/>)
            } else {
                stars.push(<TiStarOutline/>)
            }
        }
        return stars
    }

    validateRating() {
        this.setState({ initNote: this.state.note })
        noteBook(this.props.title, localStorage.getItem("email"), this.state.note)
    }

    resetRating() {
        this.setState({ note: this.state.initNote })
    }
    
    render() {

        return <div key={this.props.title + this.state.email} className="book-card">
            <h3>{this.props.title}</h3>
            <p>Auteur: {this.props.author}</p>
            <p>Nombre de livres: {this.props.nbBooks}</p>
            <p>Editeur: {this.props.publisher}</p>
            <p>Type: {this.props.type}</p>
            <p>Année: {this.props.year}</p>
            <p className="noteBook">Note: 
                { this.state.initNote < 0 ?
                    <div className="noteBookText">Non noté</div>
                    : null
                }
                <div className="noteBookStars" ref={this.stars} onMouseMove={(e) => this.changeRating(e)} onMouseLeave={() => this.resetRating()} onClick={() => this.validateRating()}>
                    { this.calculateRating(this.state.note) }
                </div>
            </p>
            { this.props.whenAdded &&
                <td className="addBook">
                    <AiFillCheckCircle onClick={() => this.addBookFromRecco()}/>
                </td>
            }
            { this.props.whenDelete &&
                <td className="deleteBook">
                    <AiTwotoneDelete onClick={() => this.deleteBook()}/>
                </td>
            }
        </div>            
    }
}

export default Book