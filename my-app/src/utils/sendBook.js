import axios from "axios";
export function getBookGoogle(title, owner) {
    axios.get("https://www.googleapis.com/books/v1/volumes?q=" + title)
        .then((res) => {
            const bookInfo = res.data.items[0].volumeInfo
            addBook(bookInfo.title, owner, bookInfo["authors"]?bookInfo.authors[0]:"unknown",
                bookInfo["publishedDate"]?bookInfo.publishedDate:"unknown",
                bookInfo["categories"]?bookInfo.categories[0]:"unknown",
                bookInfo["publisher"]?bookInfo.publisher:"unknown")
        })
        .catch((err) => {
            console.log(err)
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