import React from "react";
import '../assets/css/cover.css'
import Nav from './nav'
import Footer from './footer'
import Jumbotron from "./jumbotron";
// component for rendering bootstrap homepage/coverpage

const Cover = (props) => {
    return(
       <div className='cover-div'>
           <body className='cover-body'>
                
                <Jumbotron />
                
            </body>
        </div>
    )
}

export default Cover