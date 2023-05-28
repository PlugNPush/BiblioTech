import axios from "axios";
import React from "react";
import { Component } from "react";
import {AiTwotoneDelete} from "react-icons/ai"
import "./Book.css"
class Book extends Component {
    constructor(props) {
        super(props)
    }
    deleteBook() {
        axios.post("http://localhost:8100/api/deletebook", {owner: this.props.getEmail, title: this.props.title})
        .then((res) => {
            this.props.whenDelete()
        }).catch((err) => {
            console.log(err)
        })
    }
    render() {
        return <div className="book">
                -
            <div className="infoBook">
                {this.props.title}, {this.props.author}, {this.props.year}
            </div>
            <div className="deleteBook">
                <AiTwotoneDelete onClick={() => this.deleteBook()}/>
            </div>
        </div>
    }
}
export default Book