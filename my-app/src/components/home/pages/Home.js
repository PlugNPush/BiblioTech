import React from "react"
import { Component } from "react"
import {MdAddAPhoto} from "react-icons/md"
import {readFileContent, convertStringToListOfFile} from "utils/FileReaderUtil.js"
import {getBookGoogle} from "utils/sendBook";

class Home extends Component {
    /**
     * @description home page, the user can take a photo
     * @call in AppPage.js
     */
    constructor(props) {
        super(props)
        this.state = {addPhoto : false, book: ""}
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
        return <div>
            <div className="loadFile">
                <input type="file" onChange={(e)=>readFileContent(e, this.props.getEmail)}/>
            </div>
        </div>
    }
    addBook() {
        return <div>
            <div className="loadFile">
                <input type="text" onChange={(e) => {this.setState({book: e.target.value})}}/>
                <button  onClick={() => {
                    console.log("book", this.state.book)
                    const filtered = convertStringToListOfFile(this.state.book)
                    getBookGoogle(filtered, this.props.getEmail)
                }}>Ok</button>
            </div>
        </div>
    }
    addPhoto() {
        this.setState({addPhoto : true})
        setTimeout(() => {
            this.setState({addPhoto : false})
        }, 3000)
    }
    render() {
        return <React.Fragment>
            <div className="photo">
                Photographiez!
            </div>
            <div className="camera">
                <MdAddAPhoto onClick={() => {this.addPhoto()}}/>
            </div>
            <div>
                {this.photoAdded()}
            </div>
            <React.Fragment>
                {this.addFile()}
            </React.Fragment>
            <React.Fragment>
                {this.addBook()}
            </React.Fragment>
        </React.Fragment>
    }
}

export default Home