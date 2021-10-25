import React from 'react'
import imgBrad from '../assets/images/Brad.jpg'
import imgDanny from "../assets/images/Danny.jpeg"
import "../assets/css/developers.css"

const Developers = () => {

    return (
        <div id="wrapper">
            <figure>
            <a href="http://github.com">
            <img className="img" border="0" alt="Mail" src={imgBrad}/>
            </a>
            <a href="github.com" >
            <img className="img" border="0" alt="Facebook" src={imgDanny}/>
            </a>
            </figure>
            <br />
            <div>
                <h3>The Developers</h3>
                <p>This site is created and maintained by Brad Alexander (left) and Danny Diaz (right).</p>
                <p>Brad is the lead front-end developer and can be reached by <a href="mailto: bralexander@live.com">email</a> or via <a href="https://www.linkedin.com/in/bradley-alexander/">LinkedIn</a>.</p>
                <p>Danny is the lead backend/ML developer and can be reached by <a href="mailto: danny.jesus.diaz.94@gmail.com">email</a> or via <a href="https://www.linkedin.com/in/aiproteins/">LinkedIn</a>.</p>
                <p>If you have any comments, issues/bugs, or requests for added features, </p>
                <p>please contact the developers, or post an issue on <a href="https://github.com/danny305/mutcompute2.0">GitHub</a>.</p>
           </div>
        </div>
    )
}

export default Developers