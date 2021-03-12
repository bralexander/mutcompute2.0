import React from "react";
import '../assets/cover.css'
import Nav from './nav'
import Footer from './footer'
import Jumbotron from "./jumbotron";
// component for rendering bootstrap homepage/coverpage

const Cover = (props) => {
    return(
       <div>
           <body class="d-flex h-100 text-center text-white">
                <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                    <Nav />
                    <Jumbotron />
                    <Footer />
                </div>
            </body>
        </div>
    )
}

export default Cover