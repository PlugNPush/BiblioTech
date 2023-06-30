import React, {Component} from "react";
import NavBar from "../NavBar";
import "./Position.scss";
import "../NavBar.scss";
import {RiSendPlaneFill} from "react-icons/ri";
import {getAllGares, searchCodePostaleSncf, searchLigneSncf} from "../../../utils/FileReaderUtil";
import Book from "../entities/Book";
import Gare from "../entities/Gare";
class Position extends Component {
    constructor(props) {
        super(props);
        this.state = {codeP: "", ligne: "", gareChoisie: ""};
    }
  printGareChoisie() {
    if(this.state.gareChoisie !== "") {
        if(this.state.gareChoisie === undefined) {
            return <div className="gareChoisie">
                <p>Aucune gare choisie</p>
            </div>
        }else {
            const allGares = this.state.gareChoisie
            return <div className="gareChoisie">
                <h1 className="titreGares">Gare(s) trouvées</h1>
                <table className="listeGares">
                    <thead>
                        <tr>
                            <th>Gare</th>
                            <th>Code Postal</th>
                            <th>Ligne</th>
                            <th>Ville</th>
                            <th>Rue</th>
                        </tr>
                    </thead>
                    <tbody>
                    {allGares.map(gare => (
                        <Gare key={gare.latitude + gare.longitude} gare={gare.gare} codeP={gare.code_postal}
                              ligne={gare.ligne} ville={gare.ville} rue={gare.voie}/>
                    ))}
                    </tbody>
                </table>
            </div>
        }
    }
  }
    render() {
        return <React.Fragment>
            <NavBar/>
            <div className="positionPage">
                <h1>Boîtes à livres près de chez vous</h1>
                <div>
                    Saisissez votre code postal:
                    <input onChange={(e) => this.setState({codeP: e.target.value})}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            this.setState({gareChoisie : searchCodePostaleSncf(this.state.codeP)})
                        }
                    }}/>
                    <div className="buttonPos">
                        <RiSendPlaneFill onClick={() => this.setState({gareChoisie : searchCodePostaleSncf(this.state.codeP)})}/>
                    </div>
                </div>
                <div>
                    Saisissez la ligne de rer que vous prenez (ex: A, B, C, D, E):
                    <input onChange={(e) => this.setState({ligne: e.target.value})}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            this.setState({gareChoisie : searchLigneSncf(this.state.ligne)})
                        }
                    }}/>
                    <div className="buttonPos">
                        <RiSendPlaneFill onClick={() => this.setState({gareChoisie : searchLigneSncf(this.state.ligne)})}/>
                    </div>
                </div>
                <div>
                    <button onClick={() => {this.setState({gareChoisie : getAllGares()})}}>Afficher toutes les gares</button>
                </div>
                <div>
                    {this.printGareChoisie()}
                </div>
            </div>
        </React.Fragment>
    }
}

export default Position;