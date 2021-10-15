import '../assets/css/login.css'
import { useHistory } from 'react-router-dom'
import { withRouter } from 'react-router'
import useInput from '../hooks/useInput'


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
const match = (value1, value2) => {
  if (value1 === value2) {
    return true
  } else {
    return false
  }
}

const Reset = (props) => {
  const history = useHistory();
  const hash  = props.match.params.hash
  
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
  } = useInput((value) => match(password1, value))


  let validForm = false
    if (password1Valid && password2Valid) {
      validForm = true
    }

  const submitHandler = e => {
    e.preventDefault();
    fetch(`/api/reset/${hash}`, {
      method: 'post',
      url: '/reset',
      body: JSON.stringify(password1),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      alert(data.Status)
      history.push('/login')
    })
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
              {password1Error && (<p>Please use a strong password</p>)}
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
              {password2Error && (<p>Passwords do not match</p>)}
              <button 
              className="w-100 btn btn-lg btn-primary" 
              type="submit" 
              onClick={submitHandler}
              disabled = {!validForm}
              >Reset</button>
            </form>
          </main>
        </div>
  )
}

export default withRouter(Reset)