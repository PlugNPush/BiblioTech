import axios from "axios"
import React from "react"
import { Component } from "react"
import {AiTwotoneDelete} from "react-icons/ai"

import "./Book.scss"

class Book extends Component {
    /**
     * @description display a book
     * @call in HistoricPage.js
     */
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
        return <tr className="book">
            <td className="titleBook">{this.props.title}</td>
            <td className="authorBook">{this.props.author}</td>
            <td className="ibanBook">{this.props.iban}</td>
            <td className="nbBooksBook">{this.props.nbBooks}</td>
            <td className="publisherBook">{this.props.publisher}</td>
            <td className="typeBook">{this.props.type}</td>
            <td className="yearBook">{this.props.year}</td>
            <td className="deleteBook">
                <AiTwotoneDelete onClick={() => this.deleteBook()}/>
            </td>
        </tr>
    }
}

export default Book