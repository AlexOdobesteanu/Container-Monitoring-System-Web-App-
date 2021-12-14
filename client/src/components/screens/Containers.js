import React, { useState, useEffect } from 'react'
import logo from '../../container.jpg';
import { Link } from 'react-router-dom';

const Containers = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('/mycontainers',
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }
        ).then(res => res.json())
            .then(result => {
                //console.log(result.mycontainer)
                setData(result.mycontainer)
            })
    }, [])

    return (
        // <h1>Containers</h1>
        <div class="col s12 m7" style={{
            margin: "50px auto",
            maxWidth: "900px",
            textAlign: "center"
        }}>
            {
                data.map(item => {
                    return (
                        <div class="card horizontal" key={item._id}>
                            <div class="card-image">
                                <img src={logo} />
                            </div>
                            <div class="card-stacked">
                                <div class="card-content">
                                    <p>
                                        Type: Container
                                    </p>
                                    <p>IP Address: {item.host}</p>
                                    <p>Username for Container: {item.username}</p>
                                </div>
                                <div class="card-action">
                                    <Link to="#">View details</Link>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>

    )
}

export default Containers