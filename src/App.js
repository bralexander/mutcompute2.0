import './App.css';
import React from "react"
import { BrowserRouter as Router} from "react-router-dom"
import { Route, Switch, Redirect } from "react-router-dom"
import {useAuth} from "./auth"

import Cover from "./components/cover"
import Nav from "./components/nav"
import Footer from "./components/footer"
import Login from "./components/login"
import Compvis3 from "./components/compvis3"
import Register from "./components/register2"
import NNPage from "./components/nnPage"
import FAQ from "./components/faq"
import Forgot from "./components/forgotPass"
import Reset from "./components/resetPass"


const  PrivateRoute = ({component: Component, ...rest }) => {
  const [logged] = useAuth();

  return <Route {...rest} render={(props) => (
      logged
      ? <Component {...props} />
      : <Redirect to='/login'/>
  )} />

}


function App() {
  return (
    <div className="app">
      <Router>
        <Nav />
          <Switch>
            <Route path="/" exact component={() => <Cover />} />
            <Route path="/login" exact component={() => <Login />} />
            <Route path="/viewer3" exact component={() => <Compvis3 />} />
            <Route path="/register" exact component={() => <Register />} />
            <PrivateRoute path="/nn" component={NNPage} />
            <Route path="/faq" exact component={() => <FAQ />} />
            <Route path="/forgot" exact component={() => <Forgot />} />
            <Route path="/reset" exact component={() => <Reset />} />
          </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
