import React from "react";


const Nav = (props) => {
// bootstrap navbar
    return(
        <div>
          <header>
            <h3 className="float-md-start mb-0">MutCompute.com</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
              <a className="nav-link text-muted" href="/FAQ">FAQ</a>
              <a className="nav-link text-muted" href="/login/">Login</a>
            </nav>
          </header>
        </div>
    )
}

export default Nav