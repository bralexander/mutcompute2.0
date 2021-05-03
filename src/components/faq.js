import React from 'react'

const Accordian = (props) => {
    return (
            <div>
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            {props.question}
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                          <strong>{props.answer}</strong> {props.detail}
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
        <div class="panel-group" id="accordion"></div>
        <div class="faqHeader">{props.title}</div>
        <br/>
    </div>
    )
}

// var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
// var collapseList = collapseElementList.map(function (collapseEl) {
//   return new bootstrap.Collapse(collapseEl)
// })

const FAQ = () => {
    return(
    <div className="container-fluid">
        <div className="page-header">
            <h1>Frequently Asked Questions</h1>
        </div>
        <div className="container-fluid avoid-footer">
            <br />
            <SectionHeader title="General Questions" />
                <Accordian 
                question="Is account registration required?"
                answer="Yes."
                detail="In order to utilize MutCompute you must register and create and account."
                />
                <Accordian 
                question="Can I submit a protein we crystallized in house?"
                answer="Yes!"
                detail="This feature is now available on the predictions page."
                />
                <Accordian 
                question="Who may register for access"
                answer="Anyone!"
                detail="This tool is funded by US federal grants to be available to all"
                />
            <SectionHeader title="Neural net specific questions" />
                <Accordian 
                question="I want to run a protein through the neural net -- what are the steps?"
                answer="Simple:"
                detail="1. Register an account  2. Activate your account by clicking the email confirmaation link
                3. Login and upload your protein structure file or provide the PDB code for the protein.
                4. The results of the Neural Network will be emailed to you within 30 minutes."
                ></Accordian>
            </div>
        </div>
    )
}

export default FAQ