import axios from "axios";
export function getBookGoogle(title, owner) {
    return axios.get("https://www.googleapis.com/books/v1/volumes?q=" + title)
        .then((res) => {
            return res.data.items
        })
        .catch((err) => {
            console.log(err)
            return []
        })
}

export function addBook(title, owner, author, year, type, publisher) {
    axios.post("http://localhost:8100/api/addbook", {
        title: title,
        owner: owner,
        author: author,
        year: year,
        type: type,
        publisher: publisher
    })
        .then((res) => {
            console.log("livre ajoute")
        })
        .catch((err) => {
            console.log(err)
        })
}