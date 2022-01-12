import React, { useState, useEffect, useNavigate } from 'react'
import logo from '../../container.jpg';
import { Link } from 'react-router-dom';
import { Bar } from 'chart.js'
import Spinner from 'react-bootstrap/Spinner'
import { HashLoader } from 'react-spinners';
import { } from 'materialize-css'
import M from 'materialize-css'

const Containers = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);

    const deleteContainer = (containerid) => {
        fetch(`/deletecontainer/${containerid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
                M.toast({ html: "Successfully deleted", classes: 'rounded green' })
            })
    }


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
                setLoading(true);
            })

    }, [])

    return (
        <>
            {loading ? (<div class="col s12 m7" style={{
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
                                        <Link to="/containersinfo"
                                            state={{
                                                idContainer: item._id,
                                                host: item.host,
                                                user: item.username,
                                                password: item.password
                                            }}>View
                                            details</Link>
                                    </div>
                                </div>
                                <h5>
                                    <i className="material-icons" onClick={() => deleteContainer(item._id)}>delete</i>
                                </h5>
                            </div>
                        )
                    })
                }

            </div>) : (<div style={style}><HashLoader speedMultiplier={2}></HashLoader></div>)}

        </>

    )
}

export default Containers