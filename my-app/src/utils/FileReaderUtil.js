import {getBookGoogle} from "./sendBook.js";

function convertStringToListOfFile(listFile) {
    let filtered = listFile.replaceAll(/  +/g, ' ') //remove multiple spaces
    filtered = filtered.replaceAll(' ', '-') //remove multiple spaces
    return filtered.split("\n")
}

export function readFileContent(file) {
    const reader = new FileReader()
    reader.onload = (event) => {
        const fileContent = event.target.result
        const readBooks = convertStringToListOfFile(fileContent)
        console.log("books", readBooks)
        for(let i in readBooks) {
            console.log(i, readBooks[i])
            getBookGoogle(readBooks[i])
        }
    }
    reader.readAsText(file.target.files[0])
}