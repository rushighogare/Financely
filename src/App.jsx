import Header from "./components/Header"
import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css"
import SignupSigninComponent from "./components/SignupSignin";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
