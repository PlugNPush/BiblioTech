import axios from "axios";
export function getBookGoogle(title) {
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

export function noteBook(title, owner, note) {
    axios.post("http://localhost:8100/api/notebook", {
        title: title,
        owner: owner,
        note: note
    })
        .then((res) => {
            console.log("note ajoute")
        })
        .catch((err) => {
            console.log(err)
        })
}

export function addBookReccomandation(title, owner, author, year, type, publisher) {
    axios.post("http://localhost:8100/api/addreccobook", {
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

export function getReccomandationBook(owner) {
    axios.post("http://127.0.0.1:8000", {email: owner})
        .then((value) => {
            const listOfBooks = value.data.split("-")
            for(let i in listOfBooks) {
                getBookGoogle(listOfBooks[i]).then((value) => {
                    const res = value[0].volumeInfo
                    addBookReccomandation(listOfBooks[i], owner,res["authors"]?res.authors[0]:"unknown",
                                    res["publishedDate"]?res.publishedDate:"unknown",
                                    res["categories"]?res.categories[0]:"unknown",
                                    res["publisher"]?res.publisher:"unknown")
                }).catch((err) => {
                    console.log(err)
                })
            }
        }).catch((err) => {
            console.log(err)
        })
}