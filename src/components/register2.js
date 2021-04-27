import React, { useState, useEffect } from 'react'
import {useValidation} from "../hooks/useValidation"

const Register = (props) => {



    const [newUser, setNewUser] = useState()
    const [confirm, setConfirm] = useState({
        password1: '',
        password2: '',
        email1: '',
        email2: '',
    })
    const[error, setError] = useState()
    const [validPass, setValidPass] = useState(false)
    const [
        validLength,
        hasNumber,
        uppercase,
        lowercase,
        specialChar,
        pmatch,
        ematch,
    ] = useValidation({
        password1: confirm.password1,
        password2: confirm.password2,
        email1: confirm.email1,
        email2: confirm.email2
    })

useEffect (() => {
    validatePass()
})

const registerSubmit = e => {
    if (validPass) {
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
    })
  } else {
      alert('use a stronger password')
  }
}


const validatePass = () => {
    if (validLength && pmatch) {
        setValidPass(true)
        console.log('>8, match')
        console.log(confirm.password1, confirm.password2)
    } else {
        setValidPass(false)
        console.log('not matching')
    }
}


const setPassword1 = (event) => {
    setConfirm({ ...confirm, password1: event.target.value });
    // if (confirm.password2) { 
    //     validatePass()
    //     console.log(confirm.password1)
    // }
  };

const setPassword2 = (event) => {
    setConfirm({ ...confirm, password2: event.target.value });
    // if (confirm.password1) { 
    //     validatePass()
    //     console.log(confirm.password2)
    // }
  };

const setEmail1 = (event) => {
    setConfirm({ ...confirm, email1: event.target.value });
  };
const setEmail2 = (event) => {
    setConfirm({ ...confirm, email2: event.target.value });
  };


  return (
    <div className="container-fluid">
        <div className="container page-header move-right">
            <h1 className="dark-grey">Registration<small></small></h1>
        </div>
        <br />
            <section className="container">
                <div className="container-page">
                    <form method="POST" onSubmit={registerSubmit}>
                        
                        {/* <h3 className="pricing-header dark-grey"><strong>Registration</strong></h3> */}
                        
                        
                        <div className="row container">
                            <div className="form-group col-md-6">
                                <input 
                                type="text" 
                                id="firstName" 
                                className="form-control" 
                                placeholder="First Name" 
                                onChange={e => setNewUser({ ...newUser, first: e.target.value })}
                                required autoFocus 
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="email" 
                                id="inputEmail" 
                                className="form-control" 
                                placeholder="Email address" 
                                onChange={setEmail1}
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
                                required autoFocus 
                                />
                            </div>
                            <div className="form-group col-md-6">
                                
                                <input 
                                type="email" 
                                id="emailConfirm" 
                                className="form-control" 
                                placeholder="Confirm email" 
                                onChange={setEmail2}
                                required autoFocus 
                                />
                                {/* <span style={{color:'red'}}>{emerrors}</span> */}
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
                                required autoFocus 
                                /> 
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                placeholder="Password" 
                                onChange={setPassword1}
                                required autoFocus 
                                />
                                {/* <span style={{color:'red'}}>{pverrors}</span> */}
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
                                //onInput={validatePass}
                                required autoFocus 
                                />
                                {/* <span style={{color:'red'}}>{pmerrors}</span> */}
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
                            disabled={false}
                            //onClick={validatePass}
                            >Register</button>
                        </div>
                    </form>
                </div>
            </section>
</div>
)
}

export default Register
