import React, { useState } from 'react'
import '../assets/css/login.css'
import { useHistory } from 'react-router-dom'
//import axios from 'axios'


const Login = (props) => {
  // const [csrf, setCsrf] = useState(null);
  const [user, setUser] = useState(props.user)

  let history = useHistory();

  const loginSubmit = e => {
    e.preventDefault();
    fetch('/login', {
      method: 'post',
      url: '/login',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        console.log('User Validated, redirecting to home')
        history.push('/')
      }
      console.log(res)
      return res.json
    })
    // .then(json => {
    //   setUser(json.user) 
    //   console.log(json)
    // })
    }
  
  
  return (
        <div className="login text-center">  
          <main className="form-signin">
            <form onSubmit={loginSubmit}>
              {/* <img className="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" /> */}
              <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
              <label htmlFor="inputEmail" className="visually-hidden">Email address</label>
              <input 
              type="email" 
              id="inputEmail" 
              className="form-control" 
              placeholder="Email address" 
              onChange={e => setUser({ ...user, email: e.target.value })}
              required autoFocus 
              />
              <label htmlFor="inputPassword" className="visually-hidden">Password</label>
              <input 
              type="password" 
              id="inputPassword" 
              className="form-control" 
              placeholder="Password" 
              onChange={e => setUser({ ...user, password: e.target.value })}
              required 
              />
                  <div className="checkbox mb-3">
                    <label>
                      <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                  </div>
              <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
              {/* <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p> */}
            </form>
          </main>
        </div>
  )
}

export default Login