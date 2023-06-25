import React, {Component} from "react";
import "./Gare.scss"

class Page extends Component {
    constructor(props) {
        super(props);
    }
    clickGare() {
        const gare = this.props.gare.replace(/ /g, "")
        localStorage.setItem("gare", this.props.ville)
        window.open(`/infos/${gare}`)
    }
    render() {
        return <React.Fragment>
            <tr className="gares">
                <td className="infoGare" onClick={() => this.clickGare()}>{this.props.gare}</td>
                <td className="infoGare" onClick={() => this.clickGare()}>{this.props.codeP}</td>
                <td className="infoGare" onClick={() => this.clickGare()}>{this.props.ligne}</td>
                <td className="infoGare" onClick={() => this.clickGare()}>{this.props.ville}</td>
                <td className="infoGare" onClick={() => this.clickGare()}>{this.props.rue}</td>
            </tr>
        </React.Fragment>
    }
}

export default Page;