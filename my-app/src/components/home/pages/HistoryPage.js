import "./HistoryPage.scss";
import React, { Component } from "react"
import axios from "axios"
import Book from "../entities/Book"
import NavBar from "../NavBar"

class HistoryPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            books: [],
            search: "",
            selectedCategory: "all", // "all" by default, indicating search in all categories
            getEmail: localStorage.getItem("email")
        };
        
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
        const { name, value } = event.target;
    
        if (name === "selectedCategory") {
            this.setState({
                [name]: value,
                search: "" // Réinitialise la valeur de recherche lorsque la catégorie change
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    };

    render() {
        const filteredBooks = this.state.books.filter((book) => {
            const searchValue = this.state.search.toLowerCase();
            const category = this.state.selectedCategory;

            if (category === "all") {
                return (
                    book.title.toLowerCase().includes(searchValue) ||
                    book.author.toLowerCase().includes(searchValue) ||
                    book.publisher.toLowerCase().includes(searchValue) ||
                    book.type.toLowerCase().includes(searchValue) ||
                    book.year.toLowerCase().includes(searchValue)
                );
            } else {
                return book[category].toLowerCase().includes(searchValue);
            }
        });

        return (
            <React.Fragment>
                <NavBar />
                <div className="HistoryPage">
                    <div className="titreHistoryPage">Liste des Livres scannés :</div>
                    <div className="searchBar">
                        <input
                            type="text"
                            placeholder="Rechercher un livre"
                            value={this.state.search}
                            onChange={this.handleSearch}
                            name="search"
                        />
                        <select
                            value={this.state.selectedCategory}
                            onChange={this.handleSearch}
                            name="selectedCategory"
                        >
                            <option value="all">Toutes les catégories</option>
                            <option value="author">Auteur</option>
                            <option value="title">Titre</option>
                            <option value="publisher">Éditeur</option>
                            <option value="type">Type</option>
                            <option value="year">Année</option>
                        </select>
                    </div>

                    <h4>{filteredBooks.length} résultats</h4>
                    <div className="cards-container">
                        {filteredBooks.map((book) => (
                            <Book key={book.title+this.state.email} title={book.title} author={book.author} nbBooks={book.nbBooks} publisher={book.publisher} type={book.type} year={book.year} note={book.note} getEmail={localStorage.getItem("email")} whenDelete={this.updateBooks}/>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default HistoryPage;
