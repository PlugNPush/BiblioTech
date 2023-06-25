import React, {Component} from "react";
import "./Gare.scss"

class Page extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <React.Fragment>
            <tr className="gares">
                <td>{this.props.gare}</td>
                <td>{this.props.codeP}</td>
                <td>{this.props.ligne}</td>
                <td>{this.props.ville}</td>
                <td>{this.props.rue}</td>
            </tr>
        </React.Fragment>
    }
}

export default Page;