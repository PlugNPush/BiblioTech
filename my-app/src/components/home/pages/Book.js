import axios from "axios"
import React, { Component } from "react"

import { noteBook } from "utils/sendBook" // noteBook(title, owner, note)

import {AiTwotoneDelete} from "react-icons/ai"
import {TiStarFullOutline, TiStarHalfOutline, TiStarOutline} from "react-icons/ti"

import "./Book.scss"

class Book extends Component {
    /**
     * @description display a book
     * @call in HistoricPage.js
     */
    constructor(props) {
        super(props)
        this.state = { note: this.props.note, initNote: this.props.note }
        this.stars = React.createRef()
    }
    deleteBook() {
        axios.post("http://localhost:8100/api/deletebook", {owner: this.props.getEmail, title: this.props.title})
        .then((res) => {
            this.props.whenDelete()
        }).catch((err) => {
            console.log(err)
        })
    }

    // quand on hover sur les étoiles, ça change l'affichage des étoiles en fonction de la position de la souris (affiche les étoiles en doré par dessus les étoiles noires)
    // on peut les cliquer et ça envoie la note au serveur
    // quand la souris sort des étoiles, ça remet l'affichage de la note
    // les étoiles précédentes sont toujours affichées en doré, donc si la position de la souris est sur la première motié de l'étoile 3, les étoiles 1, 2 sont dorées et l'étoile 3 est à moitié dorée
    // on affiche des étoiles pleines, des étoiles à moitié pleines et des étoiles vides
    changeRating(e) {
        const divElement = this.stars.current // Accéder à la référence de la div
        const container = divElement.getBoundingClientRect() // Obtenir les coordonnées de la div
        const mouseX = e.clientX - container.left // Calculer la position X relative à la div
        const positionX = mouseX / container.width // Normaliser la position X entre 0 et 1
        const note = Math.round(positionX * 10) / 2 // Transformer en plage de 0 à 5 par incréments de 0.5
        // changer l'affichage des étoiles
        const children = divElement.children
        console.log(children)
        let stars = []
        for (let i = 0; i < 5; i++) { // remplacer les étoiles
            if (note >= i + 1) {
                //stars.push(2)
                stars.push(<TiStarFullOutline/>)
            } else if (note >= i + 0.5) {
                //stars.push(1)
                stars.push(<TiStarHalfOutline/>)
            } else {
                //stars.push(0)
                stars.push(<TiStarOutline/>)
            }
        }
        this.setState({ note: note })
        //console.log(stars)
    }

    calculateRating(note) {
        //this.setState({ note: note })
        //let note = this.state.note
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
    
    render() {
        return <tr className="book">
            <td className="titleBook">{this.props.title}</td>
            <td className="authorBook">{this.props.author}</td>
            <td className="nbBooksBook">{this.props.nbBooks}</td>
            <td className="publisherBook">{this.props.publisher}</td>
            <td className="typeBook">{this.props.type}</td>
            <td className="yearBook">{this.props.year}</td>
            <td className="noteBook">
                { this.props.note === -1 ?
                    <div className="noteBookText">Non noté</div>
                    : null
                }
                <div className="noteBookStars" ref={this.stars} onMouseMove={(e) => this.changeRating(e)} onMouseLeave={() => this.calculateRating(this.state.initNote)} onClick={() => noteBook(this.props.title, this.props.getEmail, this.state.note)}>
                    { this.calculateRating(this.state.note) }
                </div>
            </td>
            <td className="deleteBook">
                <AiTwotoneDelete onClick={() => this.deleteBook()}/>
            </td>
        </tr>
    }
}

export default Book