import React from "react";
import { Component } from "react";
import "./HistoricPage.css"
import Book from "./Book";
import axios from "axios";

class HistoricPage extends Component {
    constructor(props) {
        super(props)
        this.state = {books : []}
    }
    componentDidMount() {
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
                Liste des Livres scannés : {console.log("state", this.state.books)}
            </div>
            <div className="listeLivres"> 
            {
                this.state.books.map(book => (
                    <Book key={book.title+this.props.getEmail} title={book.title} author={book.author} 
                    iban= {book.iban} nbBooks={book.nbBooks} publisher={book.publisher} type={book.type} year={book.year}/>
                  ))
            }
            </div>
        </div>
    }
    
}

export default HistoricPage