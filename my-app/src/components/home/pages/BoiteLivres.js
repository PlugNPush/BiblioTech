import React, {Component} from "react";
import axios from "axios";
import Book from "../entities/Book";
import "./BoiteLivres.scss";
import Dropzone from "react-dropzone";
import {MdAddAPhoto} from "react-icons/md";

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
    handleDropBoite(acceptedFiles, gare) {
        const formData = new FormData();
        console.log(gare)
          formData.append('owner', this.state.gare)
          formData.append('image', acceptedFiles[0]);

          axios.post('http://localhost:911/process_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
          console.log(res)
          }).catch((err) => {
              console.log(err)
          })
    };
    render() {
        return <React.Fragment>
            <div>
                <h1>Boîte à livres {this.state.gare}</h1>
                <div className="camera">
                    <Dropzone onDrop={(e) => this.handleDropBoite(e, this.state.gare)}>
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <MdAddAPhoto/>
                        </div>
                      )}
                    </Dropzone>
                </div>
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