import React from "react"


const Footer = (props) => {
    return (
        <div>
            {/* <div className="d-flex h-100 text-center text-white">
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column"> */}
                <footer className="text-white-50 text-center fixed-bottom">
                    <p>A product of <a href="https://ellingtonlab.org" className="text-white">The Ellington Lab</a>, by 
                        <a href="https://github.com/danny305" className="text-white"> @danny305</a>, and 
                        <a href="https://github.com/bralexander" className="text-white"> @bralexander</a><br />
                            Based on research found  
                            <a href="/literature" className="text-white"> here</a>
                    </p>
                </footer>
            </div>
        //     </div>
        // </div>
    )
}
export default Footer