import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom"
import React from "react"
import SearchPage from "./components/home/pages/SearchPage"
import HistoryPage from "./components/home/pages/HistoryPage"
import UserPage from "./components/home/pages/UserPage"
import Home from "./components/home/pages/Home"
import Start from "./components/connection/Start"
import ReccoPage from "./components/home/pages/ReccoPage";
import Position from "./components/home/pages/Position";
import BoiteLivres from "./components/home/pages/BoiteLivres";


function App() {

  // check color-scheme to set theme, if dark then add class "dark-theme" to body
  const checkColorScheme = () => {
    if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem("theme")) || localStorage.getItem("theme") === "dark") {
      document.body.classList.add('dark-theme');
    }
  }

  // check color-scheme on load
  checkColorScheme();

  return (
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Start/>} />
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/search" element={<SearchPage/>} />
        <Route exact path="/reccomandation" element={<ReccoPage/>} />
        <Route exact path="/history" element={<HistoryPage/>} />
        <Route exact path="/user" element={<UserPage/>} />
        <Route exact path="/position" element={<Position/>} />
        <Route exact path="/infos/:name" element={<BoiteLivres/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
