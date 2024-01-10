import React, { Component } from "react"
import axios from "axios"

import Book from "../entities/Book"
import NavBar from "../NavBar"

import "./HistoryPage.scss"

class HistoryPage extends Component {
    /**
     * @description page where the user can see the books he scanned and make a research in the list
     * @call in AppPage.js
     */
    constructor(props) {
        super(props)
        this.state = {books : [], search : "", getEmail: localStorage.getItem("email")}
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
        axios.get("http://localhost:8100/api/getbooksfromowner/" + this.state.getEmail)
        .then((res) => {
            let bookList = []
            for (let i in res.data) {
                bookList.push({author : res.data[i].author, title: res.data[i].title, nbBooks: res.data[i].nbBooks,
                    publisher: res.data[i].publisher, type: res.data[i].type, year: res.data[i].year, note: res.data[i].rating})
            }
            console.log(bookList)
            this.setState({books: bookList})
        })
        .catch((err) => {
            console.log(err)
        })
    }
    handleSearch = (event) => {
        this.setState({search: event.target.value})
    }
    render() {
        const filteredBooks = this.state.books.filter(book => {
            return book.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || book.author.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || book.publisher.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || book.type.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || book.year.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || book.note.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        })

        return <React.Fragment>
            <NavBar/>
            <div className="HistoryPage">
                <div className="titreHistoryPage">
                    Liste des Livres scannés :
                </div>
                <div className="searchBar">
                    <input type="text" placeholder="Rechercher un livre" value={this.state.search} onChange={this.handleSearch}/>
                </div>
                <h4>
                    {filteredBooks.length} résultats
                </h4>
                <table className="listeLivres">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Nombre de livres</th>
                            <th>Editeur</th>
                            <th>Type</th>
                            <th>Année</th>
                            <th>Note</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredBooks.map(book => (
                        <Book key={book.title+this.state.email} title={book.title} author={book.author} nbBooks={book.nbBooks} publisher={book.publisher} type={book.type} year={book.year} note={book.note} getEmail={localStorage.getItem("email")} whenDelete={this.updateBooks}/>
                    ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    }
}

export default HistoryPage