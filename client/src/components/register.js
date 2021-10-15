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

    const regex ='^.+@.*(edu|espci.fr|psl.eu|espci.psl.eu|epfl.ch|ca|uk|au)$'

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
      } = useInput((value) => matchValidator(email1, value))

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
                    <form method="POST" onSubmit={registerSubmit} autoComplete="on">
                        <div className="row container">
                            <div className="form-group col-md-6">
                                <input 
                                type="text" 
                                id="firstName" 
                                className="form-control" 
                                placeholder="First Name" 
                                //onChange={e => setNewUser({ ...newUser, first: e.target.value })}
                                onChange={e => setFirst( e.target.value )}
                                required autoFocus minLength='2'
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="email" 
                                id="inputEmail" 
                                className="form-control" 
                                placeholder="Email (Academic only)" 
                                onChange={email1Change}
                                onBlur={email1Blur}
                                value={email1}
                                pattern={regex}
                                required 
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
                                className="form-control" 
                                placeholder="Last Name" 
                                // onChange={e => setNewUser({ ...newUser, last: e.target.value })}
                                onChange={e => setLast( e.target.value )}
                                required  minLength='2' 
                                />
                            </div>
                            <div className="form-group col-md-6">
                                
                                <input 
                                type="email" 
                                id="emailConfirm" 
                                className="form-control" 
                                placeholder="Confirm email" 
                                onChange={email2Change}
                                onBlur={email2Blur}
                                value={email2}
                                required 
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
                                className="form-control" 
                                placeholder="Institution" 
                                //onChange={e => setNewUser({ ...newUser, org: e.target.value })}
                                onChange={e => setOrg( e.target.value )}
                                required  minLength='3' 
                                /> 
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                placeholder="Password" 
                                onChange={password1Change}
                                onBlur={password1Blur}
                                value={password1}
                                required  
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
                                className="form-control" 
                                placeholder="Confirm password" 
                                onChange={password2Change}
                                onBlur={password2Blur}
                                value={password2}
                                required  
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
