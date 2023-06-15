import React, { Component } from 'react'

import NavBar from '../NavBar'
import {getBookGoogle, addBook} from "utils/sendBook"
import {readFileContent, convertStringToListOfFile} from "utils/FileReaderUtil.js"

import {RxValueNone} from "react-icons/rx"
import {AiOutlineCheck, AiFillQuestionCircle} from "react-icons/ai"
import './SearchPage.scss'

class SearchPage extends Component {
    /**
     * @description the search page
     * @call in NavBar.js
     */
    constructor(props) {
        super(props);
        this.state = {timer: null, searchResults: [], addBook:""}
    }
    addBook() { // affiche une barre de recherche ainsi que le résultat en temps réel
        return <div className="searchFile">
            <div className="searchBar">
                <input type="text" onChange={(e)=>this.handleSearch(e)}/>
                <button className="btn btn-primary" onClick={() => {
                    // reset de la barre de recherche
                    document.querySelector(".searchBar input").value = ""
                    this.setState({searchResults: []})
                }}><RxValueNone/></button>
            </div>
            <div className="searchResults">
                {this.state.searchResults.map((result) => (
                    <div className="card" key={result.id}>
                        <div className="card-header">
                            <img src={result.volumeInfo.imageLinks?result.volumeInfo.imageLinks.thumbnail:""} alt="book"/>
                            <h5 className="card-title">{result.volumeInfo.title}</h5>
                        </div>
                        <div className="card-body">
                            <p className="card-text">{result.volumeInfo.authors?result.volumeInfo.authors[0]:"unknown"}</p>
                            <p className="card-text">{result.volumeInfo.publishedDate?result.volumeInfo.publishedDate:"unknown"}</p>
                            <p className="card-text">{result.volumeInfo.categories?result.volumeInfo.categories[0]:"unknown"}</p>
                            <p className="card-text">{result.volumeInfo.publisher?result.volumeInfo.publisher:"unknown"}</p>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary" onClick={() => {
                                this.bookAddedWait(result.id)
                                const bookInfo = result.volumeInfo
                                addBook(bookInfo.title, window.email, bookInfo["authors"]?bookInfo.authors[0]:"unknown",
                                    bookInfo["publishedDate"]?bookInfo.publishedDate:"unknown",
                                    bookInfo["categories"]?bookInfo.categories[0]:"unknown",
                                    bookInfo["publisher"]?bookInfo.publisher:"unknown")
                            }}>Ajouter</button>
                            {this.bookAdded(result.id)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    }
    handleSearch(e) {
        // ajout d'un délai pour éviter de faire trop de requêtes
        if(this.state.timer) {
            clearTimeout(this.state.timer)
        }
        this.setState({timer: setTimeout(() => {
            const filtered = convertStringToListOfFile(e.target.value)
            if (filtered[0].length === 0) {
                this.setState({searchResults: []})
            } else {
                getBookGoogle(filtered).then((res) => {
                    this.setState({searchResults: res})
                })               
            }
        }, 1000)})
        //console.log("searchResults", this.state.searchResults)
    }
    bookAddedWait(titre) {
        this.setState({addBook : titre})
        setTimeout(() => {
            this.setState({addBook : ""})
        }, 3000)
    }
    bookAdded(titre) {
        if(this.state.addBook === titre) {
            return <AiOutlineCheck color="red"/>
        }
    }
    render() {
        return <React.Fragment>
            <NavBar/>
            <div className="searchPage">
                <h1>Search Page</h1>
                {this.addBook()}
            </div>
        </React.Fragment>
    }
}

export default SearchPage
