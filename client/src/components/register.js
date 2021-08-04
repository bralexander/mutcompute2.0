import React, { useState } from 'react'
//import {useValidation} from "../hooks/useValidation"
//import {login} from "../auth/index"
import useInput from '../hooks/useInput'
import { useHistory } from 'react-router-dom'

const passwordValidator = (value) => {
    let validLength  = value.trim().length >= 8
    let hasNumber =  /\d/.test(value)
    let upperCase =  value.toLowerCase() !== value
    let lowerCase =  value.toUpperCase() !== value
    let specialChar =  /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(value)
    if (validLength && hasNumber && upperCase && lowerCase && specialChar) {
        return true
    } else { 
        return false
    }
}
const matchValidator = (value1, value2) => {
    if (value1 === value2) {
    return true
    } else {
    return false
    }
}

const Register = (props) => {
    const history = useHistory();
    //const [newUser, setNewUser] = useState('')
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [org, setOrg] = useState('')

    const {
        value: password1,
        valid: password1Valid,
        hasError: password1Error,
        valueChangeHandler: password1Change,
        inputBlurHandler: password1Blur
      } = useInput((value) => passwordValidator(value))

      const {
        value: password2,
        valid: password2Valid,
        hasError: password2Error,
        valueChangeHandler: password2Change,
        inputBlurHandler: password2Blur
      } = useInput((value) => matchValidator(password1, value))

      const {
        value: email1,
        valid: email1Valid,
        hasError: email1Error,
        valueChangeHandler: email1Change,
        inputBlurHandler: email1Blur
      } = useInput((value) => value.trim()? true:false)

      const {
        value: email2,
        valid: email2Valid,
        hasError: email2Error,
        valueChangeHandler: email2Change,
        inputBlurHandler: email2Blur
      } = useInput((value) => matchValidator(email1.toLowerCase(), value.toLowerCase()))

      let validForm = false
      if (password1Valid && password2Valid && email1Valid && email2Valid) {
          //setNewUser({...newUser, email: email2, password: password2})
        validForm = true
      }


const registerSubmit = e => {
    e.preventDefault()
    fetch('/api/register', {
        method: 'post',
        url:'/register', 
        body: JSON.stringify({
            first: first,
            last: last,
            org: org,
            email: email2,
            password: password2
        }),
        headers: {
            'content-type': 'application/json'
          }
    })
    .then(res => res.json())
    .then(data => { 
       console.log(data)
       alert(Object.entries(data))
       if (data.status === 200) {
       history.push('/login')
       }
    })
  } 

//   if (res.status === 200){
//     history.push('/login')
//     res.json()
//   }

  return (
    <div className=" register container-fluid">
        <div className="container page-header move-right">
            <h1 className="dark-grey">Registration<small></small></h1>
        </div>
        <br />
            <section className="container">
                <div className="container-page">
                    <form method="POST" onSubmit={registerSubmit} >
                        <div className="row container">
                            <div className="form-group col-md-6">
                                <input 
                                type="text" 
                                id="firstName" 
                                name="given-name"
                                className="form-control" 
                                placeholder="First Name" 
                                tabIndex="1"
                                onChange={e => setFirst( e.target.value )}
                                required autoFocus minLength='2'
                                autoComplete="on"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="email" 
                                id="inputEmail"
                                name="email" 
                                className="form-control" 
                                placeholder="Email address" 
                                tabIndex="4"
                                onChange={email1Change}
                                onBlur={email1Blur}
                                value={email1}
                                required 
                                autoComplete="on"
                                />
                                {email1Error && <span>Please enter an email</span>}
                            </div>
                        </div>
                        <br />
                        <div className="row container">
                            <div className="form-group col-md-6">
                                
                                <input 
                                type="text" 
                                id="lastName"
                                name="family-name" 
                                className="form-control" 
                                placeholder="Last Name" 
                                tabIndex="2"
                                onChange={e => setLast( e.target.value )}
                                required  minLength='2' 
                                autoComplete="on"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                
                                <input 
                                type="email" 
                                id="emailConfirm" 
                                name='email'
                                className="form-control" 
                                placeholder="Confirm email"
                                tabIndex="5" 
                                onChange={email2Change}
                                onBlur={email2Blur}
                                value={email2}
                                required 
                                autoComplete="on"
                                />
                                <span>
                                {email2Error && <span style={{color:'red'}}>Emails must match</span>}
                                </span>
                            </div>
                        </div>
                        <br />
                        <div className="row container">
                            <div className="form-group col-md-6">
                                <input 
                                type="text" 
                                id="org" 
                                name="organization"
                                className="form-control" 
                                placeholder="Company/Institution" 
                                tabIndex="3"
                                onChange={e => setOrg( e.target.value )}
                                required  minLength='3' 
                                autoComplete="on"
                                /> 
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="password" 
                                id="password" 
                                name="password"
                                className="form-control" 
                                placeholder="Password"
                                tabIndex="6" 
                                onChange={password1Change}
                                onBlur={password1Blur}
                                value={password1}
                                required  
                                autoComplete="on"
                                />
                                <span>
                                {password1Error && <span style={{color:'red'}}>Please Enter a Strong Password</span>}
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
                                name="password"
                                className="form-control" 
                                placeholder="Confirm password"
                                tabIndex="7" 
                                onChange={password2Change}
                                onBlur={password2Blur}
                                value={password2}
                                required  
                                autoComplete="on"
                                />
                                <span>
                                {password2Error && <span style={{color:'red'}}>Passwords must match</span>}
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
                            disabled={!validForm}
                            >Register</button>
                        </div>
                    </form>
                </div>
            </section>
</div>
)
  }

export default Register
