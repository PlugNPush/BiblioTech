import React, {Component} from "react";
import axios from "axios";
import Book from "../entities/Book";
import "./BoiteLivres.scss";

class BoiteLivres extends Component {
    constructor(props) {
        super(props);
        this.state = {gare: localStorage.getItem("gare"), books : []};
    }
    componentDidMount() {
        axios.get(`http://localhost:8100/api/getBooksBoites/${this.state.gare}`).then(res => {
            this.setState({books: res.data})
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return <React.Fragment>
            <div>
                <h1>Boîte à livres {this.state.gare}</h1>
                <div className="listeLivres">
                    <table>
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Auteur</th>
                                <th>Genre</th>
                                <th>Année</th>
                                <th>Editeur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.books.map(book => (
                                <Book key={book.title+localStorage.getItem("email")} title={book.title} author={book.author}
                                      publisher={book.publisher} type={book.type} year={book.year}/>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    }
}
export default BoiteLivres;