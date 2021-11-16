import React, { useState }  from 'react';
import { useHistory } from 'react-router-dom'



const ViewerForm = () => {
    const [pdb, setPdb] = useState('');
 
    const history = useHistory()

    const submitProtein = e => {
        e.preventDefault()
        console.log('pdb1', pdb)
        if (pdb) {
            console.log('pdb',pdb)
            const pdbLow = pdb.toLowerCase()
            history.push(`/view/${pdbLow}`)
        } else {
            alert('please enter a 4 character PDB code')
        }
        }


const handleId = e => {
    if (e.length === 4){
        setPdb(e)
    } else {
        return
    }
} 


return (
    <div className="yes-scroll register container-fluid avoid-navbar overflow-auto">
                <div className="container col-sm-12 page-header overflow-auto">
                    <h1 className="dark-grey">Enter a PDB ID<small></small></h1>
                </div>
            <form onSubmit={submitProtein}>
                <div className='nnContainer container container-page'>
                    <div className="nnInput form-group col-sm-2">
                        <input 
                        className="form-control" 
                        placeholder="PDB ID"
                        onChange={e => handleId(e.target.value)}
                        minLength='4'
                        maxLength='4'
                        autoFocus
                        ></input>
                <div className="col-sm-6">
                    <br />
                    <button type="submit" className="w-20 btn btn-lg btn-primary">Submit</button>
                </div> 
                </div>
                </div>
        <section className="container">
            <hr />
            <div className="container">
                <br />
                <div className="col-md-6 text-justify">
                    <h3 className="dark-grey"><strong>Upon Submission</strong></h3>
                    <p>
                        By clicking on "Submit" you agree to the <a href="/terms">Terms and Conditions</a>.
                    </p>
                    <p>
                        A PDB ID is a 4 character code consisting of numbers and letters that represents a PDB File.
                        Protein Data Bank (PDB) files contain the 3D shapes of proteins, nucleic acids, and complex assemblies.
                        You can search for proteins, PDB ID's, and protein descriptions on <a href="https://www.rcsb.org">RCSB</a>.
                        Once you identify a protein of interest, simply type it's PDB ID into the box and submit to view it in 3D,
                        and colored by Machine Learning predictions. Alternatevly, you can just enter "3NIR" to see a simple example.
                    </p>
                    <p>
                        Please visit the <a href="/FAQ">FAQ</a> page for additional details.
                    </p>
                </div>
            </div>
        </section>
        </form>
    </div>
)
}

export default ViewerForm
