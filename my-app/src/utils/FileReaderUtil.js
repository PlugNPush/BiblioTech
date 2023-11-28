import {getBookGoogle, addBook} from "./sendBook.js";
import data from "../files/boites-a-livres-dans-les-gares-franciliennes.json"

export function convertStringToListOfFile(listFile) {
    let filtered = listFile.replaceAll(/  +/g, ' ') //remove multiple spaces
    filtered = filtered.replaceAll(' ', '-') //remove multiple spaces
    return filtered.split("\n")
}

export function readFileContent(file, owner) {
    const reader = new FileReader()
    reader.onload = (event) => {
        const fileContent = event.target.result
        const readBooks = convertStringToListOfFile(fileContent)
        for(let i in readBooks) {
            getBookGoogle(readBooks[i], owner)
                .then((res) => {
                    if(res.length > 0) {
                        const bookInfo = res[0].volumeInfo
                        addBook(bookInfo.title, owner, bookInfo["authors"]?bookInfo.authors[0]:"unknown",
                            bookInfo["publishedDate"]?bookInfo.publishedDate:"unknown",
                            bookInfo["categories"]?bookInfo.categories[0]:"unknown",
                            bookInfo["publisher"]?bookInfo.publisher:"unknown")
                    }
                }
            )
        }
    }
    reader.readAsText(file.target.files[0])
}

export function searchCodePostaleSncf(codePostale) {
    const codeP = parseInt(codePostale)
    for(let i in data) {
        if(data[i].code_postal === codeP) {
            return [data[i]]
        }
    }
    return undefined
}
export function searchLigneSncf(ligne) {
    const allLignes = []
    for(let i in data) {
        if(data[i].ligne === ligne) {
            allLignes.push(data[i])
        }
    }
    return allLignes.length !== 0 ? allLignes : undefined
}
export function getAllGares() {
    return data
}