import React from 'react'
import logo from '../../container.jpg';
import { Link } from 'react-router-dom';

const Containers = () => {
    return (
        // <h1>Containers</h1>
        <div class="col s12 m7" style={{
            margin: "50px auto",
            maxWidth: "900px",
            textAlign: "center"
        }}>
            <div class="card horizontal">
                <div class="card-image">
                    <img src={logo} />
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <p>
                            Container 1
                        </p>
                        <p>I will add IP here.</p>
                    </div>
                    <div class="card-action">
                        <Link to="#">View details</Link>
                    </div>
                </div>
            </div>
            <div class="card horizontal">
                <div class="card-image">
                    <img src={logo} />
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <p>
                            Container 2
                        </p>
                        <p>I will add IP here.</p>
                    </div>
                    <div class="card-action">
                        <Link to="#">View details</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Containers