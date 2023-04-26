import React from "react";
import { Component } from "react";
import Start from "./Start";

class MainPage extends Component {
    
    selectPage(page) {
        return <Start/>
    }
    render() {
        return <div>
            {this.selectPage()}
        </div>
    }
}

export default MainPage