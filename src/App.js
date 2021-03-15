import './App.css';
import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Cover from "./components/cover"
import Nav from "./components/nav"
import Footer from "./components/footer"
import Login from "./components/login"
import Viewer from "./components/viewer"





function App() {
  return (
    <div className="app">
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={() => <Cover />} />
          <Route path="/login" exact component={() => <Login />} />
          <Route path="/viewer" exact component={() => <Viewer />} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
