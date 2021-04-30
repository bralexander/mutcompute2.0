import React, { useState } from 'react'
import {useValidation} from "../hooks/useValidation"
//import {login} from "../auth/index"


const Register = (props) => {

    const [newUser, setNewUser] = useState()
    const [confirm, setConfirm] = useState({
        password1: '',
        password2: '',
        email1: '',
        email2: '',
    })
    
    const [validPass, setValidPass] = useState(true)

    const [
        validLength,
        hasNumber,
        uppercase,
        lowercase,
        ematch,
        pmatch,
        specialChar,
    ] = useValidation({
        password1: confirm.password1,
        password2: confirm.password2,
        email1: confirm.email1,
        email2: confirm.email2
    })


const registerSubmit = e => {
    e.preventDefault()
    fetch('/api/register', {
        method: 'post',
        url:'/register', 
        body: JSON.stringify(newUser),
        headers: {
            'content-type': 'application/json'
          }
    })
    .then(r => { 
        if (r.status === 200) {
            console.log(r)
            alert('Success ')
        }
        else {alert('error')}
    })
    // .then(r => r.json())
    // .then(token => {
    //     if (token.access_token){
    //       login(token)
    //       console.log(token)          
    //     }
    // })
  } 



const validatePass = () => {
    if (validLength && hasNumber && uppercase && lowercase && specialChar && pmatch && ematch ) {
        setValidPass(true)
        setNewUser({...newUser, password: confirm.password1})
        setNewUser({...newUser, email: confirm.email1.toLowerCase()})
    } else {
        setValidPass(false)
    }
}



const setPassword1 = (event) => {
    setConfirm({ ...confirm, password1: event.target.value });
  };

const setPassword2 = (event) => {
    setConfirm({ ...confirm, password2: event.target.value });
  };

const setEmail1 = (event) => {
    setConfirm({ ...confirm, email1: event.target.value });
  };
const setEmail2 = (event) => {
    setConfirm({ ...confirm, email2: event.target.value });
  };


  return (
    <div className=" register container-fluid">
        <div className="container page-header move-right">
            <h1 className="dark-grey">Registration<small></small></h1>
        </div>
        <br />
            <section className="container">
                <div className="container-page">
                    <form method="POST" onSubmit={registerSubmit}>
                        <div className="row container">
                            <div className="form-group col-md-6">
                                <input 
                                type="text" 
                                id="firstName" 
                                className="form-control" 
                                placeholder="First Name" 
                                onChange={e => setNewUser({ ...newUser, first: e.target.value })}
                                required autoFocus minLength='2'
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="email" 
                                id="inputEmail" 
                                className="form-control" 
                                placeholder="Email address" 
                                onChange={setEmail1}
                                onKeyUp={validatePass}
                                required autoFocus 
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row container">
                            <div className="form-group col-md-6">
                                
                                <input 
                                type="text" 
                                id="lastName" 
                                className="form-control" 
                                placeholder="Last Name" 
                                onChange={e => setNewUser({ ...newUser, last: e.target.value })}
                                required autoFocus minLength='2'
                                />
                            </div>
                            <div className="form-group col-md-6">
                                
                                <input 
                                type="email" 
                                id="emailConfirm" 
                                className="form-control" 
                                placeholder="Confirm email" 
                                onChange={setEmail2}
                                onKeyUp={validatePass}
                                required autoFocus 
                                />
                                <span>
                                {validPass || ematch ? <span></span> : <span style={{color:'red'}}>Emails must match</span>}
                                </span>
                            </div>
                        </div>
                        <br />
                        <div className="row container">
                            <div className="form-group col-md-6">
                                <input 
                                type="text" 
                                id="org" 
                                className="form-control" 
                                placeholder="Company/Institution" 
                                onChange={e => setNewUser({ ...newUser, org: e.target.value })}
                                required autoFocus minLength='3'
                                /> 
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                placeholder="Password" 
                                onChange={setPassword1}
                                onKeyUp={validatePass}
                                required autoFocus 
                                />
                                <span>
                                {validPass ? <span></span> : <span>Must Contain: </span>}
                                {validPass || validLength ? <span></span> : <span style={{color:'red'}}>8 Characters, </span>}
                                {validPass || hasNumber ? <span></span> : <span style={{color:'red'}}>a Number, </span>}
                                {validPass || uppercase ? <span></span> : <span style={{color:'red'}}>an Uppercase, </span>}
                                {validPass || lowercase ? <span></span> : <span style={{color:'red'}}>a Lowercase, </span>}
                                {validPass || specialChar ? <span></span> : <span style={{color:'red'}}>a Special* </span>}
                                </span>
                            </div>
                        </div>
                        <br />
                        <div className="row container">
                            <div className="form-group col-md-6">
                            </div>
                            <div className="form-group col-md-6">
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                className="form-control" 
                                placeholder="Confirm password" 
                                onChange={setPassword2}
                                onKeyUp={validatePass}
                                required autoFocus 
                                />
                                <span>
                                {validPass || pmatch ? <span></span> : <span style={{color:'red'}}>be matching</span>}
                            </span>
                            </div>
                        </div>

                        <hr/>
                        <div className="col-md-6 text-justify">
                            <h3 className="dark-grey"><strong>Terms and Conditions</strong></h3>
                            <p>
                                By clicking on "Register" you agree to our <a href="/terms"> terms and conditions. </a>
                            </p>
                            <p>
                                For any questions or issues with MutCompute please contact<a href="mailto:danny.diaz@utexas.edu?subject=Protein_NN_accessibility"> danny.diaz@utexas.edu.</a>
                            </p>
                            <p>
                                Please visit the <a href="{{ url_for('FAQ_page') }}">FAQ</a> for additional details.
                            </p>
                            <button 
                            className="w-20 btn btn-lg btn-primary" 
                            id='submitBtn' 
                            type="submit" 
                            disabled={!validPass}
                            >Register</button>
                        </div>
                    </form>
                </div>
            </section>
</div>
)
  }

export default Register
