import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom"
import React from "react"

import SearchPage from "./components/home/pages/SearchPage"
import HistoricPage from "./components/home/pages/HistoricPage"
import UserPage from "./components/home/pages/UserPage"
import Home from "./components/home/pages/Home"
import Start from "./components/connection/Start"
import ReccoPage from "./components/home/pages/ReccoPage";
import Position from "./components/home/pages/Position";
import BoiteLivres from "./components/home/pages/BoiteLivres";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Start/>} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/search" element={<SearchPage/>} />
        <Route exact path="/reccomandation" element={<ReccoPage/>} />
        <Route exact path="/historic" element={<HistoricPage/>} />
        <Route exact path="/user" element={<UserPage/>} />
        <Route exact path="/position" element={<Position/>} />
        <Route exact path="/infos/:name" element={<BoiteLivres/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
