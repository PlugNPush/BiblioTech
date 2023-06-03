import axios from "axios";
export function getBookGoogle(title) {
    axios.get("https://www.googleapis.com/books/v1/volumes?q=" + title)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
}