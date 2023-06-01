import React from "react"
import { Component } from "react"

import Book from "./Book"
import axios from "axios"

import "./HistoricPage.scss"

class HistoricPage extends Component {
    /**
     * @description page where the user can see the books he scanned
     * @call in AppPage.js
     */
    constructor(props) {
        super(props)
        this.state = {books : []}
        this.updateBooks = this.updateBooks.bind(this)
        this.getBooksOwner = this.getBooksOwner.bind(this)
    }
    componentDidMount() {
        this.getBooksOwner()
    }
    updateBooks() {
        this.getBooksOwner()
    }
    getBooksOwner() {
        axios.get("http://localhost:8100/api/getbooksfromowner/" + this.props.getEmail)
        .then((res) => {
            let bookList = []
            for (let i in res.data) {
                bookList.push({author : res.data[i].author, iban: res.data[i].iban, title: res.data[i].title, nbBooks: res.data[i].nbBooks, 
                    publisher: res.data[i].publisher, type: res.data[i].type, year: res.data[i].year})
            }
            this.setState({books: bookList})
        })
        .catch((err) => {
            console.log(err)
        })
    }
    render() {
        return <div className="historicPage">
            <div className="titreHistoricPage">
                Liste des Livres scannés :
            </div>
            <table className="listeLivres"> 
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>IBAN</th>
                        <th>Nombre de livres</th>
                        <th>Editeur</th>
                        <th>Type</th>
                        <th>Année</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.books.map(book => (
                    <Book key={book.title+this.props.getEmail} title={book.title} author={book.author} 
                    iban= {book.iban} nbBooks={book.nbBooks} publisher={book.publisher} type={book.type} year={book.year} 
                    getEmail={this.props.getEmail} whenDelete={this.updateBooks}/>
                  ))}
                </tbody>
            </table>
        </div>
    }
}

export default HistoricPage