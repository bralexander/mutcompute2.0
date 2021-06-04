import React, { useState } from 'react'


const Forgot = (props) => {
  // const [csrf, setCsrf] = useState(null);
  const [user, setUser] = useState(props.user)

  

  const loginSubmit = e => {
    e.preventDefault();
    fetch('/api/forgot', {
      method: 'post',
      url: '/forgot',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => res.json()
    //no redirect, email will be sent link
    )
  .then(data => { 
     console.log(data)
     alert(Object.keys(data))

  })
    
    //.then(data => console.log(data))
    
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
              <h1 className="h3 mb-3 fw-normal">Enter your email</h1>
              <label htmlFor="inputEmail" className="visually-hidden">Email address</label>
              <input 
              type="email" 
              id="inputEmail" 
              className="form-control" 
              placeholder="Email address" 
              onChange={e => setUser({ ...user, email: e.target.value.toLowerCase() })}
              required autoFocus 
              />
              
                  {/* <div className="checkbox mb-3">
                    <label>
                      <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                  </div> */}
              <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={loginSubmit}>Send Email</button>
              {/* <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p> */}
            </form>
          </main>
        </div>
  )
}

export default Forgot