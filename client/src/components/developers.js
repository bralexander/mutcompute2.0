import React from 'react'
import imgBrad from '../assets/images/Brad.jpg'
import imgDanny from "../assets/images/Danny.jpeg"
import "../assets/css/developers.css"

const Developers = () => {

    return (
        <div className="register">
            <div className="container">
                <h1>About</h1>
                <p>
                    MutCompute is a self-supervised 3D Convolutional Neural Network trained and maintained by the Ellington lab here at UT Austin.
                    It is provided to the public for non-commercial usage and to help advance protein engineering research. Danny Diaz is still actively
                    developing new CNN models and will continue to update the site with additional models as they mature into publications. 
                </p>
            <br />
            <div>
                <div className="img-cont2">
                    <h5>The Developers</h5>
                    <figure>
                    <a href="http://github.com">
                    <img className="img" border="0" alt="Mail" src={imgBrad}/>
                    </a>
                    <a href="github.com" >
                    <img className="img" border="0" alt="Facebook" src={imgDanny}/>
                    </a>
                    </figure>
                <div>
                    <p>MutCompute.com was created by Danny Diaz (right). 
                    Brad Alexander is the lead front-end developer and can be reached by <a href="mailto: bralexander@live.com">email</a> or via <a href="https://www.linkedin.com/in/bradley-alexander/">LinkedIn</a>.
                    Danny Diaz is the backend developer and lead machine learning engineer and can be reached by <a href="mailto: danny.jesus.diaz.94@gmail.com">email</a> or via <a href="https://www.linkedin.com/in/aiproteins/">LinkedIn</a>.
                    If you have any comments, issues/bugs, or requests for added features, 
                    please contact the developers, or post an issue on <a href="https://github.com/danny305/mutcompute2.0">GitHub</a>.
                    </p> 
            </div>
           </div>
        </div>
        </div>
    </div>
    )
}

export default Developers