import React from "react"

import "components/home/NavBar.scss"
import {useNavigate} from "react-router-dom";

function PopUpExit(props) {
    /**
     * @description base of the pop ups
     * @call in MainPage.js
     */
    const navigate = useNavigate();

    function handleConfirmExit() {
        localStorage.setItem("email", "")
        navigate("/")
    }
    function handleCancelExit() {
        props.setPopup()
    }

    return <React.Fragment>{(
        <div className="greyScreen" onClick={() => {handleCancelExit();}}>
            <div className="confirmation-box exitPopUp" onClick={(e) => {e.stopPropagation();}}>
                <p>Voulez-vous quitter ?</p>
                <div className="centered">
                    <button onClick={() => { handleConfirmExit(); }}>Oui</button>
                    <button onClick={() => { handleCancelExit(); }}>Non</button>
                </div>
            </div>
        </div>
    )}</React.Fragment>
}

export default PopUpExit