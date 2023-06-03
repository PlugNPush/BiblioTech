import React from "react"
import { Component } from "react"
import {MdAddAPhoto} from "react-icons/md"
import {readFileContent} from "../../../utils/FileReaderUtil.js"

class Home extends Component {
    /**
     * @description home page, the user can take a photo
     * @call in AppPage.js
     */
    constructor(props) {
        super(props)
        this.state = {addPhoto : false}
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
                <input type="file" onChange={readFileContent}/>
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
        </React.Fragment>
    }
}

export default Home