import React from 'react'

export default function Card() {
  return (
    <div>
        <div className="container">
            <div className="row">
                <div className="col-md-6 ">
                    <div className="card">
                        <div className="card-body">
                            <img src="https://plus.unsplash.com/premium_photo-1683140721927-aaed410fae29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1aXR8ZW58MHx8MHx8fDA%3D" alt="" />
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" className="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                        <img src="https://plus.unsplash.com/premium_photo-1683140721927-aaed410fae29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1aXR8ZW58MHx8MHx8fDA%3D" alt="" />
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" className="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
