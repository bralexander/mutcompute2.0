import '../assets/css/login.css'
import { useHistory } from 'react-router-dom'
import { withRouter } from 'react-router'
import useInput from '../hooks/useInput'
//import {useValidation} from '../hooks/useValidation'
//import {useAuth, login, logout} from "../auth/index"

let validLength = (value) => value.length >= 8
let hasNumber = (value) => /\d/.test(value)
let upperCase = (value) => value.toLowerCase() !== value
let lowerCase = (value) => value.toUpperCase() !== value
let specialChar = (value) => /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(value)
let match = (value1, value2) => value1 === value2

const Reset = (props) => {
  const history = useHistory();

  const hash  = props.match.params.hash
  //console.log(hash)


  const {
    value: password1,
    valid: password1Valid,
    hasError: password1Error,
    valueChangeHandler: password1Change,
    inputBlurHandler: password1Blur
  } = useInput((value) => validLength(value) && hasNumber(value) && upperCase(value) && lowerCase(value) && specialChar(value)
  )

  const {
    value: password2,
    valid: password2Valid,
    hasError: password2Error,
    valueChangeHandler: password2Change,
    inputBlurHandler: password2Blur
  } = useInput((value) => match(password1, value))



  let validForm = false

  if (password1Valid && password2Valid) {
    validForm = true
  }

  const resetSubmit = e => {
    e.preventDefault();
    fetch(`/api/reset/${hash}`, {
      method: 'post',
      url: '/reset',
      body: JSON.stringify(password1),
      headers: {
        'content-type': 'application/json'
        //send jwt in header?
      }
    })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      alert(`Password reset for: ${Object.values(data)}`)
      history.push('/login')
    })
    // .then(res => {
    //   if (res.status === 200) {
    //     console.log('User Validated, redirecting to home')
    //     history.push('/')
    //   }
    //   console.log(res)
    //   return res.json
    // })
    // .then(json => {
    //   setUser(json.user) 
    //   console.log(json)
    // })
    }
  
  
  return (
    
        <div className="login text-center">  
          <main className="form-signin">
            <form >
              {/* <img className="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" /> */}
              <h1 className="h3 mb-3 fw-normal">Reset Password</h1>
              <input 
              type="password" 
              id="password1" 
              className="form-control" 
              placeholder="New Password" 
              onChange = {password1Change}
              onBlur = {password1Blur}
              value= {password1}              
              required autoFocus 
              />
              {password1Error && (<p>Error1</p>)}
              <input 
              type="password" 
              id="password 2" 
              className="form-control" 
              placeholder="Confirm New Password"
              onChange = {password2Change}
              onBlur = {password2Blur}
              value= {password2}
              required 
              />
              {password2Error && (<p>Error-2</p>)}
              <button 
              className="w-100 btn btn-lg btn-primary" 
              type="submit" 
              onClick={resetSubmit}
              disabled = {!validForm}
              >Reset</button>
            </form>
          </main>
        </div>
  )
}

export default withRouter(Reset)