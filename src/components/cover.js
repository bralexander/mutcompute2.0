import React from "react";
import '../assets/css/cover.css'
import Jumbotron from "./jumbotron";
// component for rendering bootstrap homepage/coverpage

const Cover = (props) => {
    return(
       <div className='no-scroll cover-div '>
                <Jumbotron />   
        </div>
    )
}

export default Cover