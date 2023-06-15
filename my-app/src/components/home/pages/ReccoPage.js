import React, {Component} from "react"
import axios from "axios"

import NavBar from "../NavBar"
import Book from "./Book"

import "./ReccoPage.scss"

class ReccoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {books : []}
    }
    componentDidMount() {
        axios.get("http://localhost:8100/api/getreccobooksfromowner/" + window.email)
        .then((res) => {
            let bookList = []
            for (let i in res.data) {
                bookList.push({author : res.data[i].author, title: res.data[i].title,
                    publisher: res.data[i].publisher, type: res.data[i].type, year: res.data[i].year})
            }
            this.setState({books: bookList})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() {
        return <React.Fragment>
            <NavBar/>
            <div className="reccoPage">
                <h1>Reccomandations de livres :</h1>
                <table className="listeLivres">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Editeur</th>
                            <th>Type</th>
                            <th>Année</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.books.map(book => (
                        <Book key={book.title+window.email} title={book.title} author={book.author} publisher={book.publisher} type={book.type} year={book.year} whenDelete={this.updateBooks}/>
                    ))}
                    </tbody>
                </table>
            </div>

        </React.Fragment>
    }
}

export default ReccoPage;