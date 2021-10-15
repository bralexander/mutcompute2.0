import React from 'react'
import "../assets/css/faq.css"


const Accordian = (props) => {
    return (
            <div>
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            {props.question}
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                          <strong>{props.answer}</strong> 
                          {props.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
            </div>
    )
}

const SectionHeader = (props) => {
    return(
    <div>
        <div className="panel-group" id="accordion"></div>
        <div className="faqHeader">{props.title}</div>
        <br/>
    </div>
    )
}


const FAQ = () => {
    return(

    <div className="yes-scroll container-fluid overflow-auto">
        <div className="page-header">
            <h1>Frequently Asked Questions</h1>
        </div>
        <div className="container-fluid avoid-footer overflow-auto">
            <br />
            <SectionHeader title="General Questions" />
                <Accordian 
                question="Is account registration required? "
                answer="Yes. "
                detail="In order to utilize MutCompute you must register and create and account."
                />
                <Accordian 
                question="Can I submit a protein we crystallized in house?"
                answer="No: "
                detail="This feature is currently unavailable."
                />
                <Accordian 
                question="Who may register for access"
                answer="Persons associated with academic institutions: "
                detail="Unfortunately this website is only avaiallable to Staff and associates of academic institutions, and you will be required to provide an academic email (.edu etc) to register. If you are associated with an academic institution, and are unable to register, please contact: danny.diaz@utexas.edu"
                />
            <SectionHeader title="Neural net specific questions" />
                <Accordian 
                question="What are the steps to run a protein through the neural net?"
                answer="Simple: "
                detail="1. Register an account  2. Activate your account by clicking the email confirmaation link
                3. Login and PDB code for the protein in the Predictions page.
                4. The results of the Neural Network will be emailed to you within one hour (dependent on PDB file size).
                *. The load cached checkbox, will return predictions from the database if the Protein has already been run (faster). If the PDB file has been updated recently, consider unchecking this box."
                ></Accordian>
            <SectionHeader title="Mutcompute-View instructions" />
                <Accordian 
                question="Tips and tricks for using the viewer. "
                answer="Simple:"
                detail="Left button hold and move to rotate camera around center.
                Left button click to pick atom.
                Left button click residue to toggle atom view.
                Left button click space to zoom out.
                Middle button hold and move to zoom camera in and out.
                Middle button click to center camera on atom.
                Right button hold and move to translate camera in the screen plane."
                ></Accordian>
            </div>
        </div>
    )
}

export default FAQ