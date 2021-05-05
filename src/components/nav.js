import React from "react";

const Nav = (props) => {
// bootstrap navbar
    return(
      <div>
        <div className="nav-cont d-flex h-100 text-center text-white">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header>
            <h3 className="float-md-start mb-0">MutCompute.com</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
              <a className="nav-link text-muted" href="/register">Register</a>
              <a className="nav-link text-muted" href="/login/">Login</a>
            </nav>
          </header>
        </div>
        </div>
      </div>
    )
}

export default Nav