import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";
import React from "react";

import SearchPage from "./components/home/pages/SearchPage";
import HistoricPage from "./components/home/pages/HistoricPage";
import Home from "./components/home/pages/Home";
import Start from "./components/connection/Start";

window.email = ""

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Start/>} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/search" element={<SearchPage/>} />
        <Route exact path="/historic" element={<HistoricPage/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
