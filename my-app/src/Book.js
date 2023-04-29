import React from "react";
import { Component } from "react";

class Book extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div className="book">
            - {this.props.title}, {this.props.author}, {this.props.year}
        </div>
    }
}
export default Book