import './App.css';
import React, { useEffect } from "react"
import { BrowserRouter as Router} from "react-router-dom"
import { Route, Switch, Redirect } from "react-router-dom"
import {useAuth} from "./auth"

import Cover from "./components/cover"
import Nav from "./components/nav"
import Footer from "./components/footer"

import Login from "./components/login"
import Register from "./components/register"

import Compvis3 from "./components/compvis3"
import NNPage from "./components/nnPage"
import ViewerForm from "./components/viewerForm"
import Literature from './components/literature'

import FAQ from "./components/faq"
import Terms from './components/terms';

import Forgot from "./components/forgotPass"
import Reset from "./components/resetPass"
import EmailConf from './components/emailConf';

import PetaseWt from "./components/petaseWt"
import PetaseThermo from "./components/petaseThermo"
import PetaseFast from "./components/petaseWt"
import BstPolymerase from "./components/polymerase"



const  PrivateRoute = ({component: Component, ...rest }) => {
  const [logged] = useAuth();

  useEffect(() => {
    document.title = "MutCompute"
  }, [])

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
            <Route path="/viewerForm" exact component={() => <ViewerForm />} />
            <Route path="/viewer/:id" exact component={() => <Compvis3 />} />
            <Route path="/register" exact component={() => <Register />} />
            <Route path="/petase/5xjh" exact component={() => <PetaseWt />} />
            <Route path="/petase/6ij6" exact component={() => <PetaseThermo />} />
            <Route path="/petase/tk14" exact component={() => <PetaseFast />} />
            <Route path="/polymerase/3tan" exact component={() => <BstPolymerase />} />
            <PrivateRoute path="/nn" component={NNPage} />
            <Route path="/faq" exact component={() => <FAQ />} />
            <Route path="/terms" exact component={() => <Terms />} />
            <Route path="/forgot" exact component={() => <Forgot />} />
            <Route path="/api/reset/:hash" component={() => <Reset />} />
            <Route path="/api/email_confirmation/:token" component={() => <EmailConf />} />
            <Route path="/literature" exact component={() => <Literature />} />
          </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
