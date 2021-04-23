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

    const [pmerrors, setPMErrors] = useState('')
    const [pverrors, setPVErrors] = useState('')
    const [emerrors, setEMErrors] = useState('')

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
        if (newUser.password.length >= 8) {
            setContainsEight(true)
            // setPVErrors('')
        } else {
            setContainsEight(false)
            setPVErrors('must be 8 characters long')
        }

        if (newUser.password.toUpperCase() !== newUser.password) {
            setContainsLL(true)
            // setPVErrors('')
        } else {
            setContainsLL(false)
            setPVErrors('must contain a lower case letter')
        }

        if (newUser.password.toLowerCase() !== newUser.password) {
            setContainsUL(true)
            // setPVErrors('')
        } else {
            setContainsUL(false)
            setPVErrors('must contain an Uppercase letter')
        }

        if (/\d/.test(newUser.password)){
            setContainsNum(true)
            // setPVErrors('')
        } 
        else {
            setContainsNum(false)
            setPVErrors('must contain a number')
        }

        if (/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(newUser.password)){ 
            setContainsSpec(true)
            // setPVErrors('')
        } else {
            setContainsSpec(false)
            setPVErrors('must contain a special character')
        }

        if (newUser.email !== '' && newUser.email === confirm.email){
            setEmailMatch(true)
            setEMErrors('')
            console.log('emailMatch')
        } else {
            setEmailMatch(false)
            setEMErrors('Emails do not match')
            //console.log(emerrors)
        }

        if (newUser.password !== '' && newUser.password === confirm.password) {
            setPassMatch(true)
            setPMErrors('')
            //console.log(pmerrors)
        } else {
            setPassMatch(false) 
            setPMErrors('Passwords do not match')
        }
        if (containsEight && containsLL && containsUL && containsNum && containsSpec) {
            setPVErrors('')
        }

        if (emailMatch && passMatch && containsEight && containsLL && containsUL && containsNum && containsSpec) { 
            setSubmit(true)
            console.log('validated!')
        } else{
            setSubmit(false)
            //console.log("not validated")
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
                                    onKeyUp={validatePass}
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
                                    onKeyUp={validatePass}
                                    required autoFocus 
                                    />
                                    <span style={{color:'red'}}>{emerrors}</span>
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
                                    <span style={{color:'red'}}>{pverrors}</span>
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
                                    <span style={{color:'red'}}>{pmerrors}</span>
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
