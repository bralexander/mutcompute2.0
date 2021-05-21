import React, { useState } from 'react'
import '../assets/css/login.css'
import { useHistory } from 'react-router-dom'
//import {useAuth, login, logout} from "../auth/index"


const Login = (props) => {
  // const [csrf, setCsrf] = useState(null);
  const [user, setUser] = useState(props.user)

  const history = useHistory();

  const resetSubmit = e => {
    e.preventDefault();
    fetch('/api/reset', {
      method: 'post',
      url: '/reset',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
        //send jwt in header?
      }
    })
    .then(r => r.json())
    .then(res => {
          if (res.status === 200) {
            console.log('Password updated, redirecting to login')
            history.push('/login')     
    }
    else {
      console.log("Please type in correct username/password")
    }
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
              id="password" 
              className="form-control" 
              placeholder="password" 
              onChange={e => setUser({ ...user, email: e.target.value.toLowerCase() })}
              required autoFocus 
              />
              <input 
              type="password" 
              id="confirm password" 
              className="form-control" 
              placeholder="Confirm Password" 
              onChange={e => setUser({ ...user, password: e.target.value })}
              required 
              />
                  {/* <div className="checkbox mb-3">
                    <label>
                      <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                  </div> */}
              <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={resetSubmit}>Reset</button>
              {/* <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p> */}
            </form>
          </main>
        </div>
  )
}

export default Login