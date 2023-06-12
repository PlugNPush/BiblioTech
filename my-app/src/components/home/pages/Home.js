import React, { Component } from "react"
import {MdAddAPhoto} from "react-icons/md"
import {RxValueNone} from "react-icons/rx"
import {AiOutlineCheck, AiFillQuestionCircle} from "react-icons/ai"
import {readFileContent, convertStringToListOfFile} from "utils/FileReaderUtil.js"
import {getBookGoogle, addBook} from "utils/sendBook";
import Popup from 'reactjs-popup';

import "./Home.scss"
import NavBar from "../NavBar";

class Home extends Component {
    /**
     * @description home page, the user can take a photo
     * @call in AppPage.js
     */
    constructor(props) {
        super(props)
        this.state = {addPhoto : false, book: "", timer: null, searchResults: [], addBook:""}
        this.photoAdded = this.photoAdded.bind(this)
    }
    photoAdded() {
        if(this.state.addPhoto) {
            return <div id="photoAdded">
                Photo Ajoutée
            </div>
        }
    }
    addFile() {
        return <div className="loadFile">
              <Popup trigger={<button id="questionMark"><AiFillQuestionCircle/></button>} modal>
                {(close) => (
                  <div className="popup">
                    <h2>Format du Fichier</h2>
                    <p>Chaque titre doit être sur une ligne différente</p>
                    <button id="closePopup" onClick={close}>Fermer</button>
                  </div>
                )}
              </Popup>
            <input className="fileRead" type="file" onChange={(e)=>readFileContent(e, this.props.getEmail)}/>
        </div>
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
                                addBook(bookInfo.title, this.props.getEmail, bookInfo["authors"]?bookInfo.authors[0]:"unknown",
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
                getBookGoogle(filtered, this.props.getEmail).then((res) => {
                    this.setState({searchResults: res})
                })               
            }
        }, 1000)})
        //console.log("searchResults", this.state.searchResults)
    }
    addPhoto() {
        this.setState({addPhoto : true})
        setTimeout(() => {
            this.setState({addPhoto : false})
        }, 3000)
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
        return <div className="appPage">
            <NavBar/>
            <div className="choosePageSite">
                <div className="photo">
                    Photographiez!
                </div>
                <div className="camera">
                    <MdAddAPhoto onClick={() => {this.addPhoto()}}/>
                </div>
                {this.photoAdded()}
                {this.addFile()}
                {this.addBook()}
            </div>

        </div>
    }
}

export default Home