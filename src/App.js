import './App.css';
import React from "react"
import { BrowserRouter as Router} from "react-router-dom"
import { Route, Switch, Redirect } from "react-router-dom"
import {useAuth} from "./auth"

import Cover from "./components/cover"
import Nav from "./components/nav"
import Footer from "./components/footer"
import Login from "./components/login"
//import Viewer from "./components/viewer"
import Compvis2 from "./components/compvis2"
//import CompViewer from "./components/compvisViewer"
import Structure from "./components/structure"
import Register from "./components/register2"
import NNPage from "./components/nnPage"
import FAQ from "./components/faq"



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
            <Route path="/viewer2" exact component={() => <Compvis2 />} />
            {/* <Route path="/viewer" exact component={() => <CompViewer />} /> */}
            <Route path="/struc" exact component={() => <Structure />} />
            {/* <Route path="/ngl" exact component={() => <Viewer />} /> */}
            <Route path="/register" exact component={() => <Register />} />
            <PrivateRoute path="/nn" component={NNPage} />
            <Route path="/faq" exact component={() => <FAQ />} />
          </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
