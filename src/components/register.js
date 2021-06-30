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
    const [newUser, setNewUser] = useState()

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
      } = useInput((value) => password1? matchValidator(password1, value): false)

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
          setNewUser({...newUser, email: email2, password: password2})
        validForm = true
      }
      
    // const [confirm, setConfirm] = useState({
    //     password1: '',
    //     password2: '',
    //     email1: '',
    //     email2: '',
    // })
    
    // const [validPass, setValidPass] = useState(true)

    // const [
    //     validLength,
    //     hasNumber,
    //     uppercase,
    //     lowercase,
    //     ematch,
    //     pmatch,
    //     specialChar,
    // ] = useValidation({
    //     password1: confirm.password1,
    //     password2: confirm.password2,
    //     email1: confirm.email1,
    //     email2: confirm.email2
    // })

    


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
    .then(res => {
        if (res.status === 200){
            history.push('/login')
        }
        return res.json()
    })
    .then(data => { 
       console.log(data)
       alert(Object.keys(data))

    })
    // if (r.status === 200) {
    //     console.log(r.body)
    //     alert('Success ')
    // }
    // else {alert('error')}
    // .then(r => r.json())
    // .then(token => {
    //     if (token.access_token){
    //       login(token)
    //       console.log(token)          
    //     }
    // })
  } 



// const validatePass = () => {
//     if (validLength && hasNumber && uppercase && lowercase && specialChar && pmatch && ematch ) {
//         setValidPass(true)
//         //dont have 2 setNewUser calls in the same function
//         //setNewUser({...newUser, password: confirm.password1})
//         setNewUser({...newUser, email: confirm.email1.toLowerCase(), password: confirm.password1})
//         console.log(newUser.password)
//     } else {
//         setValidPass(false)
//     }
// }



// const setPassword1 = (event) => {
//     setConfirm({ ...confirm, password1: event.target.value });
//     //console.log(confirm.password1)
//   };

// const setPassword2 = (event) => {
//     setConfirm({ ...confirm, password2: event.target.value });
//   };

// const setEmail1 = (event) => {
//     setConfirm({ ...confirm, email1: event.target.value });
//   };

// const setEmail2 = (event) => {
//     setConfirm({ ...confirm, email2: event.target.value });
//   };


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
                                onChange={email1Change}
                                onBlur={email1Blur}
                                value={email1}
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
                                onChange={e => setNewUser({ ...newUser, last: e.target.value })}
                                required minLength='2'
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
                                placeholder="Company/Institution" 
                                onChange={e => setNewUser({ ...newUser, org: e.target.value })}
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
