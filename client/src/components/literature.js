import React from 'react'

const Literature = (props) => {

    return (
        <div className="register">
            <div className="container">
                <h1>Literature</h1>
                <br />
                <ul>
                    <li><a href="https://pubs.acs.org/doi/abs/10.1021/acssynbio.0c00345">Discovery of Novel Gain-of-Function Mutations Guided by Structure-Based Deep Learning</a></li>
                    <li><a href="https://pubs.acs.org/doi/10.1021/acs.biochem.1c00451">Improved Bst DNA Polymerase Variants Derived via a Machine Learning Approach</a></li>
                    <li><a href="https://link.springer.com/article/10.1007%2Fs10867-021-09593-6" >Learning the local landscape of protein structures with convolutional neural networks</a></li>
                    <li><a href="https://www.biorxiv.org/content/10.1101/2021.10.10.463845v1" >Deep learning redesign of PETase for practical PET degrading applications</a></li>
                </ul>
            </div>
        </div>
    )
}
export default Literature