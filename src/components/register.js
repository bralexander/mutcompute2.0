import React, { useState } from 'react'


const Register = (props) => {
    const [newUser, setNewUser] = useState({
        password: '',
        email: '',
    })

    const [confirm, setConfirm] = useState({
        password: '',
        email: '',
    })

    const [errors, setErrors] = useState({
        pMatch: '',
        pValid: '',
        eMatch: '',
    })

    const [submit, setSubmit] = useState(false)
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



    const validatePass = () => {
        if (newUser.password.length >= 8) setContainsEight(true)
        else {
            setContainsEight(false)
        }
        if (newUser.password.toUpperCase() !== newUser.password) setContainsLL(true)
        else setContainsLL(false)
        if (newUser.password.toLowerCase() !== newUser.password) setContainsUL(true)
        else setContainsUL(false)
        if (/\d/.test(newUser.password))  setContainsNum(true)
        else setContainsNum(false)
        if (/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(newUser.password)) setContainsSpec(true)
        else setContainsSpec(false)
        if (confirm.email.length > 5 && newUser.email === confirm.email) setEmailMatch(true)
        else setEmailMatch(false)
        if (newUser.password === confirm.password) setPassMatch(true)
        else {
            setPassMatch(false) 
            setErrors({...errors, pMatch: 'Passwords do not match'})
        }
        if (emailMatch && passMatch && containsEight && containsLL && containsUL && containsNum && containsSpec) { 
            setSubmit(true)
            setErrors({...errors, pMatch: '', pValid: '', eMatch: ''})
            console.log('validated!')
        }
        else{
            setSubmit(false)
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
                                    onChange={e => setConfirm({ ...confirm, email: e.target.value})}
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
                                    type="password" 
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
                                    type="password" 
                                    id="confirmPassword" 
                                    className="form-control" 
                                    placeholder="Confirm password" 
                                    onChange={e => setConfirm({ ...confirm, password: e.target.value}) }
                                    onKeyUp={validatePass}
                                    required autoFocus 
                                    />
                                    <span style={{color:'red'}}>{errors.pMatch}</span>
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
                                
                                <button className="w-20 btn btn-lg btn-primary" id='submitBtn' type="submit" disabled={!submit}>Register</button>
                            </div>
                        </form>
                    </div>
                </section>
    </div>
    )
}

export default Register
