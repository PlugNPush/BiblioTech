import React, {Component} from "react";
import NavBar from "../NavBar";
import "./Position.scss";
import "../NavBar.scss";
import {RiSendPlaneFill} from "react-icons/ri";
class Position extends Component {
    constructor(props) {
        super(props);
        this.state = {position: null, codeP: "", added: false, ligne: "", ligneAdded: false};
    }
    componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ position: position.coords });
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }
  codePostaleAdded() {
        if(this.state.added) {
          return <div className="codePAdded">
              <p>Code postale ajouté</p>
          </div>
      }
  }
  ligneAdded() {
        if(this.state.ligneAdded) {
          return <div className="codePAdded">
              <p>Ligne de RER ajoutée</p>
          </div>
      }
  }
  sendCodePostale() {
    this.setState({added: true})
    setTimeout(() => {
        this.setState({added: false})
    }, 3000)
    console.log(this.state.codeP)
  }
  sendLigne() {
      this.setState({ligneAdded: true})
    setTimeout(() => {
        this.setState({ligneAdded: false})
    }, 3000)
    console.log(this.state.ligne)
  }
  printError() {
        return <div>
            <p>La position n'a pas été authorisée</p>
        </div>
  }
  portal() {
    if (this.state.position) {
        return <div>
            <p>Latitude: {this.state.position.latitude}</p>
            <p>Longitude: {this.state.position.longitude}</p>
        </div>
    } else {
        return this.printError();
    }
  }
    render() {
        return <React.Fragment>
            <NavBar/>
            <div className="positionPage">
                <h1>Search Page</h1>
                <div>
                    <p>{this.portal()}</p>
                    Saisissez votre code postal:
                    <input onChange={(e) => this.setState({codeP: e.target.value})}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            this.sendCodePostale()
                        }
                    }}/>
                    <div className="buttonPos">
                        <RiSendPlaneFill onClick={() => this.sendCodePostale()}/>
                    </div>
                    <div>
                        {this.codePostaleAdded()}
                    </div>

                </div>
                <div>
                    Saisissez la ligne de rer que vous prenez (ex: A, B, C, D, E):
                    <input onChange={(e) => this.setState({ligne: e.target.value})}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            this.sendLigne()
                        }
                    }}/>
                    <div className="buttonPos">
                        <RiSendPlaneFill onClick={() => this.sendLigne()}/>
                    </div>
                    <div>
                        {this.ligneAdded()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default Position;