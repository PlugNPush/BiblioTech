import React, {Component} from "react";
import axios from "axios";
import Book from "../entities/Book";
import "./BoiteLivres.scss";
import Dropzone from "react-dropzone";
import {MdAddAPhoto} from "react-icons/md";

class BoiteLivres extends Component {
    constructor(props) {
        super(props);
        this.state = {gare: localStorage.getItem("gare"), books : [], addPhoto : false};
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
        this.addPhoto()
          formData.append('owner', gare)
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
    addPhoto() {
        this.setState({addPhoto : true})
        setTimeout(() => {
            this.setState({addPhoto : false})
        }, 3000)
    }
    photoAdded() {
        if(this.state.addPhoto) {
            return <div id="photoAdded">
                Photo Ajoutée
            </div>
        }
    }
    render() {
        return <React.Fragment>
            <div className="test">
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
                {this.photoAdded()}
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