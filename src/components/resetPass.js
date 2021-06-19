import React, { useState } from 'react'
import '../assets/css/login.css'
import { useHistory } from 'react-router-dom'
import { withRouter } from 'react-router'
//import {useAuth, login, logout} from "../auth/index"


const Reset = (props) => {
  // const [csrf, setCsrf] = useState(null);
  const [user, setUser] = useState(props.user)

  const history = useHistory();


  const hash  = props.match.params.hash
  console.log(hash)

  const resetSubmit = e => {
    e.preventDefault();
    fetch(`/api/reset/${hash}`, {
      method: 'post',
      url: '/reset',
      body: JSON.stringify(user),
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
              id="password" 
              className="form-control" 
              placeholder="New Password" 
              onChange={e => setUser({ ...user, password: e.target.value })}
              required autoFocus 
              />
              <input 
              type="password" 
              id="confirm password" 
              className="form-control" 
              placeholder="Confirm New Password" 
              onChange={e => setUser({ ...user, passwordConfirm: e.target.value })}
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

export default withRouter(Reset)