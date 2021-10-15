import React from "react";


const Jumbotron = (props) => {
    return ( 
        <div>
            <div className="d-flex h-100 text-center text-white">
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <main className="jumbotron px-3 mb-0 ">
                    <h1 className="middle-title">Welcome to MutCompute</h1>
                    <p className="lead">Modern solutions for protein engineering. <br /> Deep Learning guided predictions for protein mutagenesis,<br /> visualized in 3D. </p>
                    <p className="lead">
                      <a href="/NN/" className="j-btn btn btn-lg btn-secondary fw-bold border-dark rounded">Predict</a>
                      <a href="/viewer/3nir" className="j-btn btn btn-lg btn-secondary fw-bold border-dark rounded">Visualize</a>
                    </p>
                </main>
            </div>
            </div>
        </div>
    )
}

export default Jumbotron