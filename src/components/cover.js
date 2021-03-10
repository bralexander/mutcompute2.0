import React from "react";
import ReactDOM from "react-dom"
// component for rendering bootstrap homepage/coverpage

const Cover = (props) => {
    return(
        <body className="d-flex h-100 text-center text-white bg-dark">  
          <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
            <header className="mb-auto">
              <div>
                <h3 className="float-md-start mb-0">MutCompute.com</h3>
                <nav className="nav nav-masthead justify-content-center float-md-end">
                  <a className="nav-link active" aria-current="page" href="/">Home</a>
                  <a className="nav-link" href="/FAQ">FAQ</a>
                  <a className="nav-link" href="/login/">Login</a>
                </nav>
              </div>
            </header>
            <main className="px-3">
              <h1 className="middle-title">Welcome to MutCompute</h1>
              <p className="lead">Modern solutions for protein engineering. <br /> Deep Learning guided predictions for protein mutagenesis,<br /> visualized in 3D. </p>
              <p className="lead">
                <a href="/NN/" className="btn btn-lg btn-secondary fw-bold border-dark rounded">Predict</a>
                <a href="/ngl" className="btn btn-lg btn-secondary fw-bold border-dark rounded">Visualize</a>
              </p>
            </main>
            <footer className="mt-auto text-white-50">
              <p>A product of <a href="https://ellingtonlab.org" className="text-white">The Ellington Lab</a>, by 
                  <a href="https://github.com/danny305" className="text-white">@danny305</a>, and 
                  <a href="https://github.com/bralexander" className="text-white">@bralexander</a><br/>
                      <a>Based on research that can be seen on</a>
                      <a href="https://www.biorxiv.org/content/10.1101/833905v1" className="text-white">biorxiv</a>
              </p>
            </footer>
          </div>
        </body>
    )
}

export default Cover