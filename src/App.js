import './App.css';
import React from "react"
import Footer from './components/footer'




function App() {
  return (
    <div>
      <body class="d-flex h-100 text-center text-white bg-dark">
    
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header class="mb-auto">
        <div>
          <h3 class="float-md-start mb-0">MutCompute.com</h3>
          <nav class="nav nav-masthead justify-content-center float-md-end">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
            <a class="nav-link" href="/FAQ">FAQ</a>
            <a class="nav-link" href="/login/">Login</a>
          </nav>
        </div>
      </header>
    
      <main class="px-3 mb-auto ">
        <h1 class="middle-title">Welcome to MutCompute</h1>
        <p class="lead">Modern solutions for protein engineering. <br /> Deep Learning guided predictions for protein mutagenesis,<br /> visualized in 3D. </p>
        <p class="lead">
          <a href="/NN/" class="btn btn-lg btn-secondary fw-bold border-dark rounded">Predict</a>
          <a href="/ngl" class="btn btn-lg btn-secondary fw-bold border-dark rounded">Visualize</a>
        </p>
      </main>
    
      <footer class="text-white-50">
        <p>A product of <a href="https://ellingtonlab.org" class="text-white">The Ellington Lab</a>, by 
            <a href="https://github.com/danny305" class="text-white"> @danny305</a>, and 
            <a href="https://github.com/bralexander" class="text-white"> @bralexander</a><br/>
                Based on research that can be seen on
                <a href="https://www.biorxiv.org/content/10.1101/833905v1" class="text-white"> biorxiv</a>
        
        </p>
      </footer>
    </div>
      </body>
    </div>
  );
}

export default App;
