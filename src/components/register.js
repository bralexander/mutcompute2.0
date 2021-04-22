import React, { useState } from 'react'


const Register = (props) => {
    const [newUser, setNewUser] = useState()

    const [submit, setSubmit] = useState(true)
    const [containsEight, setContainsEight] = useState(false)
    const [containsUL, setContainsUL] = useState(false)
    const [containsLL, setContainsLL] = useState(false)
    const [containsNum, setContainsNum] = useState(false)
    const [containsSpec, setContainsSpec] = useState(false)
    const [passMatch, setPassMatch] = useState(false)
    const [emailMatch, setEmailMatch] = useState(false)



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
        .then(r => { 
            if (r.status === 200) {
                console.log(r)
                alert('Success ')
            }
        })
    }

    const confirmEmail = e => {
        if (newUser.email && e === newUser.email) {
            setEmailMatch(true)
            console.log('email confirmed')
        }
        else {
            setEmailMatch(false)
        }
    }

    const confirmPass = e => {
        if (newUser.password && e === newUser.password) { 
            setPassMatch(true)
            console.log('password confirmed')
        }
        else {
            setPassMatch(false)
        }
    }

    const validatePass = () => {
        if (newUser.password && newUser.password.length >= 8) setContainsEight(true)
        if (newUser.password && newUser.password.toUpperCase() !== newUser.password) setContainsLL(true)
        if (newUser.password && newUser.password.toLowerCase() !== newUser.password) setContainsUL(true)
        if (newUser.password && /\d/.test(newUser.password))  setContainsNum(true)
        if (newUser.password && /[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(newUser.password)) setContainsSpec(true)
        if (emailMatch && passMatch && containsEight && containsLL && containsUL && containsNum && containsSpec) { 
            setSubmit(false)
            console.log('validated!')
        }
        else{
            setSubmit(true)
            console.log("not validated")
        }
    }

    // const checkForm = () => {
    //     if vlaidatePass && confirmEmail === true) {
    //         document.getElementById('submitBtn').disabled = false
    //     } else {
    //         document.getElementById('submitBtn').disabled = true
    //     }
    // }

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
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
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
                                    onChange={e => confirmEmail(e.target.value)}
                                    required autoFocus 
                                    />
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
                                    type="text" 
                                    id="password" 
                                    className="form-control" 
                                    placeholder="Password" 
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    onKeyUp={validatePass}
                                    required autoFocus 
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row container">
                                <div className="form-group col-md-6">
                                </div>
                                <div className="form-group col-md-6">
                                <input 
                                    type="text" 
                                    id="inputEmail" 
                                    className="form-control" 
                                    placeholder="Confirm password" 
                                    onChange={e => confirmPass(e.target.value) }
                                    onKeyUp={validatePass}
                                    required autoFocus 
                                    />
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
                                
                                <button className="w-20 btn btn-lg btn-primary" id='submitBtn' type="submit" disabled={submit}>Register</button>
                            </div>
                        </form>
                    </div>
                </section>
    </div>
    )
}

export default Register
