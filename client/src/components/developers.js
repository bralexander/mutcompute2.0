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
                Where darkness was I look upon the light.
                Father, our eyes are opening at last. Your holy world awaits us, as our sight is finally restored and we can see. We thought we suffered. But we had forgot the Son whom You created. Now we see that darkness is our own imagining, and light is there for us to look upon. Christ's vision changes darkness into light, for fear must disappear when love has come. Let me forgive Your holy world today, that I may look upon its holiness and understand it but reflects my own.
                Our Love awaits us as we go to Him, and walks beside us showing us the way. He fails in nothing. He the End we seek, and He the Means by which we go to Him.
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
                    <p>This site is created and maintained by Brad Alexander (left) and Danny Diaz (right). 
                    Brad is the lead front-end developer and can be reached by <a href="mailto: bralexander@live.com">email</a> or via <a href="https://www.linkedin.com/in/bradley-alexander/">LinkedIn</a>.
                    Danny is the lead backend/ML developer and can be reached by <a href="mailto: danny.jesus.diaz.94@gmail.com">email</a> or via <a href="https://www.linkedin.com/in/aiproteins/">LinkedIn</a>.
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