import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import M from 'materialize-css'
import "../../App.css"
import { TextInput } from 'react-materialize';
import { drawPoint } from 'chart.js/helpers';

const ClusterInfo = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const location = useLocation();

    const idCluster = location.state.idCluster
    const domainName = location.state.domainName
    const nickname = location.state.nickname


    useEffect(() => {
        fetch("/containersinfo", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domainName: domainName,
                nickname: nickname
            })
        }).then(res => res.json())
            .then(result => {
                setData(result.containers)
                console.log(result.containers)

            })
    }, [])

    return (
        <div style={{
            background: "rgb(40,44,52)",
            minHeight: '150vh',
            overflow: 'auto'
        }}>
            <div class="col s12 m7" style={{
                margin: "50px auto",
                maxWidth: "900px",
                textAlign: "center"
            }}>
                {
                    data.map(item => {
                        return (
                            <div>
                                <div class="card horizontal">
                                    <div class="card-image">
                                    </div>
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <p id='white-text'>
                                                Type:<b style={{ color: 'rgb(32,151,207)' }}> Container</b>
                                            </p>
                                            <p id='white-text'>Name: <b style={{ color: 'rgb(32,151,207)' }}> {item.Names}</b></p>
                                            {
                                                item.State === 'running' ?
                                                    (<div>
                                                        <p id='white-text'>State: <b id='green-text'> {item.State}</b></p>
                                                        <p id='white-text'>Status: <b id='green-text'> {item.Status}</b></p>
                                                    </div>)
                                                    : (<div>
                                                        <p id='white-text'>State: <b style={{ color: 'red' }}> {item.State}</b></p>
                                                        <p id='white-text'>Status: <b style={{ color: 'red' }}> {item.Status}</b></p>
                                                    </div>)
                                            }
                                            <p id='white-text'>ID: <b style={{ color: 'rgb(32,151,207)' }}> {item.Id}</b></p>
                                            <p id='white-text'>Image: <b style={{ color: 'rgb(32,151,207)' }}>{item.Image}</b></p>
                                        </div>

                                        {
                                            item.State === 'running' ? (<div class="card-action">
                                                <Link to="/containerdata" style={{ color: 'rgb(32, 151, 207)' }}
                                                    state={{
                                                        idContainer: item.Id,
                                                        domainName: domainName,
                                                        nickname: nickname
                                                    }}>View
                                                    details</Link>
                                            </div>) : (<div></div>)
                                        }

                                    </div>
                                </div>


                            </div>

                        )
                    })
                }

            </div>
        </div >
    )

}

export default ClusterInfo