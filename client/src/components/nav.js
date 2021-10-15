import React from "react";
import { useAuth } from "../auth";



const Nav = (props) => {
// bootstrap navbar

const [logged] = useAuth()

    return(
       <div>
        <div className="nav-cont d-flex h-100 text-center text-white">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header>
            <a href="/"><h3 className="float-md-start mb-0">MutCompute.com</h3></a>
            {!logged?
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a className="nav-link text-muted" href="/register">Register</a>
              <a className="nav-link text-muted" href="/login/">Login</a>
            </nav>
            :
            <nav className="nav nav-masthead justify-content-center float-md-end">
            <a className="nav-link text-muted"  href="/nn/">Predict</a>
            <a className="nav-link text-muted" href="/viewer/3nir">View</a>
            <button className="nav-link dropdown-toggle text-muted" id="navbarDarkDropdownMenuLink"
             data-bs-toggle="dropdown" aria-expanded="false">
              Menu
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
              <li><a className="dropdown-item" href="/">Home</a></li>
              <li><a className="dropdown-item" href="/login">logout</a></li>
              <li><a className="dropdown-item" href="/FAQ">FAQ</a></li>
              <li><a className="dropdown-item" href="/literature/">Literature</a></li>
            </ul>
          </nav>
          }
          </header>
        </div>
        </div>
      </div>
      
    )
}

export default Nav