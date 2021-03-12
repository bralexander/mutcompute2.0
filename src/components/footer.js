import React from "react"


const Footer = (props) => {
    return (
        <div>
            <footer className="text-white-50 fixed-bottom">
                <p>A product of <a href="https://ellingtonlab.org" className="text-white">The Ellington Lab</a>, by 
                    <a href="https://github.com/danny305" className="text-white"> @danny305</a>, and 
                    <a href="https://github.com/bralexander" className="text-white"> @bralexander</a><br />
                        Based on research that can be seen on 
                        <a href="https://www.biorxiv.org/content/10.1101/833905v1" className="text-white"> biorxiv</a>
                </p>
            </footer>
        </div>
    )
}
export default Footer