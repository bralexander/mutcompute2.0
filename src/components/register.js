import React, { useState } from 'react'

const Register = (props) => {
    const [newUser, setNewUser] = useState()
    
    console.log(newUser)

    return (
        <div className="container-fluid">
            <div className="container page-header move-right">
                <h1 className="dark-grey">Registration<small></small></h1>
            </div>
            <br />
                <section className="container">
                    <div className="container-page">
                        <form method="POST">
                            
                            {/* <h3 className="pricing-header dark-grey"><strong>Registration</strong></h3> */}
                            
                            
                            <div className="row container">
                                <div className="form-group col-md-6">
                                    <input 
                                    type="text" 
                                    id="inputEmail" 
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
                                    id="inputEmail" 
                                    className="form-control" 
                                    placeholder="Last Name" 
                                    onChange={e => setNewUser({ ...newUser, last: e.target.value })}
                                    required autoFocus 
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    
                                    <input 
                                    type="email" 
                                    id="inputEmail" 
                                    className="form-control" 
                                    placeholder="Confirm email" 
                                    onChange={e => setNewUser({ ...newUser, org: e.target.value })}
                                    required autoFocus 
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row container">
                                <div className="form-group col-md-6">
                                    <input 
                                    type="text" 
                                    id="inputEmail" 
                                    className="form-control" 
                                    placeholder="Company/Institution" 
                                    onChange={e => setNewUser({ ...newUser, org: e.target.value })}
                                    required autoFocus 
                                    /> 
                                </div>
                                <div className="form-group col-md-6">
                                    <input 
                                    type="text" 
                                    id="inputEmail" 
                                    className="form-control" 
                                    placeholder="Password" 
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
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
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
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
                                
                                <button className="w-20 btn btn-lg btn-primary" type="submit">Register</button>
                            </div>
                        </form>
                    </div>
                </section>
    </div>
    )
}

export default Register
