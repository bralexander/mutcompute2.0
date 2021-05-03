import React from 'react'



const FAQ = () => {
    return (
        <div className="container-fluid">
            <div className="page-header">
                <h1>FAQ <small>Frequently Asked Questions</small></h1>
            </div>
            <div className="container-fluid avoid-footer">
                <br />

                <div className="panel-group" id="accordion">
                    <div className="faqHeader">General questions</div>
                    <br />

                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                Is account registration required?
                            </button>
                          </h2>
                          <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                              <strong>Yes.</strong> In order to utilize MutCompute you must register and create and account.
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />

                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Can I submit a protein we crystallized in house?
                            </button>
                          </h2>
                          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                              <strong>Yes!</strong> This feature is now available.
                            </div>
                          </div>
                        </div>
                    </div>
                    </div>
                    </div>



    )
}

export default FAQ