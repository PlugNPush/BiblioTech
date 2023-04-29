import React from "react";
import { Component } from "react";
import {MdAddAPhoto} from "react-icons/md"

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {addPhoto : false}
        this.photoAdded = this.photoAdded.bind(this)
    }
    photoAdded() {
        if(this.state.addPhoto) {
            return <div>
                Photo Ajoutée
            </div>
        }
    }
    addPhoto() {
        this.setState({addPhoto : true})
        setTimeout(() => {
            this.setState({addPhoto : false})
        }, 3000)
    }
    render() {
        return <div>
            <div className="photo">
                Photographiez!
            </div>
            <div className="camera">
                <MdAddAPhoto onClick={() => {this.addPhoto()}}/>
            </div>
            <div>
                {this.photoAdded()}
            </div>
        </div>
    }
}

export default Home