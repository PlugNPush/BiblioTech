import React, { Component } from 'react'
import axios from 'axios'
import { AiOutlineCheck } from 'react-icons/ai'

import NavBar from '../NavBar'
import { getBookGoogle, addBook } from 'utils/sendBook'

import './ReccoPage.scss'

class ReccoPage extends Component {
    constructor(props) {
        super(props);
        this.state = { books: [], addBook: "" }
    }

    componentDidMount() {
        this.getBooksReccomended()
    }

    getBooksReccomended() {
        axios.get("http://localhost:8100/api/getreccobooksfromowner/" + localStorage.getItem("email"))
        .then(async (res) => {
            let bookList = [];
            for (let book of res.data) {
                let googleBookInfo = await getBookGoogle(book.title);
                if (googleBookInfo.length > 0) {
                    let bookInfo = googleBookInfo[0].volumeInfo;
                    bookList.push({
                        title: bookInfo.title || book.title,
                        author: bookInfo.authors ? bookInfo.authors[0] : "Inconnu",
                        publisher: bookInfo.publisher || "Inconnu",
                        year: bookInfo.publishedDate || "Inconnu",
                        image: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : "",
                        type: bookInfo.categories ? bookInfo.categories[0] : "Inconnu"
                    });
                }
            }
            this.setState({ books: bookList });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    bookAddedWait(title) {
        this.setState({ addBook: title })
        setTimeout(() => {
            this.setState({ addBook: "" })
        }, 3000)
    }

    bookAdded(title) {
        if (this.state.addBook === title) {
            return <AiOutlineCheck color="red" />
        }
    }

    render() {
        return <React.Fragment>
            <NavBar />
            <div className="reccoPage">
                <h1>Recommandations de livres :</h1>
                <div className="searchResults">
                    {this.state.books.sort((a, b) => a.title.localeCompare(b.title)).map((book) => (
                        <div className="card" key={book.id}>
                            <div className="card-header">
                                <img src={book.image} alt="book" />
                                <h5 className="card-title">{book.title}</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{book.author}</p>
                                <p className="card-text">{book.year}</p>
                                <p className="card-text">{book.type}</p>
                                <p className="card-text">{book.publisher}</p>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary" onClick={() => {
                                    this.bookAddedWait(book.title)
                                    addBook(book.title, localStorage.getItem("email"), book.author, book.year, book.type, book.publisher)
                                }}>Ajouter</button>
                                {this.bookAdded(book.title)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    }
}

export default ReccoPage;