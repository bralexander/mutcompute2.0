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
    <div className="yes-scroll container-fluid avoid-navbar overflow-auto">
                <div className="col-sm-12 page-header overflow-auto">
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
                        ></input>
                <div className="col-sm-6">
                    <br />
                    <button type="submit" className="w-20 btn btn-lg btn-primary">Submit</button>
                </div> 
                </div>
                </div>
        <section className="container">
            <hr />
            {/* <div className="container">
                <br />
                <div className="col-md-6 text-justify">
                    <h3 className="dark-grey"><strong>Upon Submission</strong></h3>
                    <p>
                        By clicking on "Submit" you agree to the <a href="/terms">Terms and Conditions</a>.
                    </p>
                    <p>
                        The data will be emailed to you upon completion.
                    </p>
                    <p>
                        Protein Structure convolutional neural networks are on going research projects in the Ellington Lab, therefore,
                        MutCompute may be temporarily offline for updates and the addition of new features and models.
                        If you encounter any problems please email <a href="mailto: danny.diaz@utexas.edu">danny.diaz@utexas.edu</a>.
                    </p>
                    <p>
                        Please visit the <a href="/FAQ">FAQ</a> page for additional details.
                    </p>
                </div>
            </div> */}
        </section>
        </form>
    </div>
)
}

export default ViewerForm
