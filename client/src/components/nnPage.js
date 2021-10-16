import React, { useState }  from 'react';
import {authFetch} from '../auth'


const NNPage = () => {
    const [pdb, setPdb] = useState({id: '', loadCache: true});
 
    

    const submitProtein = e => {

        // ** Future feature**
        // if (pdbFile) { 
        //     e.preventDefault()
        //     fetch('/api/nn', {
        //         method: 'post',
        //         url:'/nn', 
        //         body: pdbFile,
        //         headers: {
        //             'content-type': 'text/csv'
        //           }
        //     })
        //     .then(r => { 
        //         if (r.status === 200) {
        //             console.log(r)
        //             alert('Running the net on your pdb file. This could take up to 15 minutes. Please check your email, and spam folder for the results. ')
        //         }
        //         else {alert('error')}
        //     })
        // }
        // else if (!pdbFile && pdbId) {
        // **

        if (pdb) {
        e.preventDefault()
        authFetch('/api/nn', {
            method: 'post',
            url:'/nn', 
            body: JSON.stringify(pdb),
            headers: {
                'content-type': 'application/json'
              }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.Result)
            console.log("Data: ", data)
        })
        // .then(r => { 
        //     if (r.status === 200) {
        //         console.log(r)
        //         alert('Fetching pdb from RCSB, and running the net on it. This could take up to 15 minutes. Please check your email, and spam folder for the results. ')
        //     }
        //     else {alert('error')}
        // })
    } else {
        alert('please fill form')
    }
    }


// const handleFile = e => {
//     const file = e.target.value
//     const formData = new FormData()
//     formData.append('file', file)
//     setPdbFile(formData)
// }

const handleId = e => {
    console.log(e)
    if (e.length === 4){
        setPdb({...pdb, id: e.toUpperCase()})
        console.log('4')
    } else {
        return
    }
} 

const rerunHandler = e => {
    if (e.target.checked) {
    setPdb({...pdb, loadCache: true})
    } else {
        setPdb({...pdb, loadCache: false})
    }
}
console.log('loadCache:', pdb.loadCache)

return (
    <div className="yes-scroll container-fluid avoid-navbar overflow-auto">
                <div className="col-sm-12 page-header overflow-auto">
                    <h1 className="dark-grey">Protein Crystal Structure Submission<small></small></h1>
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
                    </div>
                    <div className="checkbox mb-3">
                    <label>
                      <input type="checkbox" value="loadCache" onChange={rerunHandler} checked={pdb.loadCache}/> load cached predictions
                    </label>
                  </div>
                        {/* SAVED FOR FUTURE FEATURE
                         <label className="form-label">Upload Custom/In-house PDB:</label>
                    <div className="form-group col-sm-3">
                        <input 
                        className="form-control form-control-sm" 
                        type="file" 
                        id="formFile"
                        onChange={handleFile}>    
                        </input>
                    </div> */}
                    <div className="col-sm-6">
                     <br />
                     <button type="submit" className="w-20 btn btn-lg btn-primary">Submit</button>
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
            </div>
        </section>
        </form>
    </div>
)
}

export default NNPage