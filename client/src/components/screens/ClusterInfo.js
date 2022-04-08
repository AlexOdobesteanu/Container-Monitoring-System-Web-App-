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
import { CircleLoader, DotLoader, HashLoader, MoonLoader, RingLoader } from 'react-spinners';
import { ReactSpinner } from 'react-spinning-wheel';


function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const ClusterInfo = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const [loading, setLoading] = useState(false)
    const [isRunning, setIsRunning] = useState(true);

    const [selectedRunning, setSelectedRunning] = useState(false);
    const [selectedExit, setSelectedExit] = useState(false);

    const [runningCount, setRunningCount] = useState(0);
    const [exitedCount, setExitedCount] = useState(0);

    const [delay, setDelay] = useState(4000);
    const [data, setData] = useState([])
    const location = useLocation();

    const idCluster = location.state.idCluster
    const domainName = location.state.domainName
    const nickname = location.state.nickname

    const seeRunning = () => {
        setSelectedExit(false)
        setSelectedRunning(!selectedRunning)
        console.log(selectedRunning)
    }

    const seeExited = () => {
        setSelectedRunning(false)
        setSelectedExit(!selectedExit)
    }

    const renderRunning = () => {

        console.log(data)
        if (data.length != 0) {
            return (
                <div>
                    {
                        data.map(item => {
                            if (item.State == 'running') {
                                return (
                                    <div class="card horizontal">
                                        <div class="card-image">
                                        </div>
                                        <div class="card-stacked">
                                            <div class="card-content">
                                                <p id='white-text'>
                                                    Type:<b style={{ color: 'rgb(32,151,207)' }}> Container</b>
                                                </p>
                                                <p id='white-text'>Name: <b style={{ color: 'rgb(32,151,207)' }}> {item.Names}</b></p>
                                                <p id='white-text'>State: <b id='green-text'> {item.State}</b></p>
                                                <p id='white-text'>Status: <b id='green-text'> {item.Status}</b></p>
                                                <p id='white-text'>ID: <b style={{ color: 'rgb(32,151,207)' }}> {item.Id}</b></p>
                                                <p id='white-text'>Image: <b style={{ color: 'rgb(32,151,207)' }}>{item.Image}</b></p>
                                            </div>
                                            <div class="card-action">
                                                <Link to="/containerdata" style={{ color: 'rgb(32, 151, 207)' }}
                                                    state={{
                                                        idContainer: item.Id,
                                                        domainName: domainName,
                                                        nickname: nickname
                                                    }}>View
                                                    details</Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div></div>
                                )
                            }

                        })
                    }
                </div >
            )
        }

    }

    const renderExited = () => {
        if (data.length != 0) {
            return (
                <div>
                    {
                        data.map(item => {
                            if (item.State == 'exited') {
                                return (
                                    <div class="card horizontal">
                                        <div class="card-image">
                                        </div>
                                        <div class="card-stacked">
                                            <div class="card-content">
                                                <p id='white-text'>
                                                    Type:<b style={{ color: 'rgb(255, 99, 132)' }}> Container</b>
                                                </p>
                                                <p id='white-text'>Name: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Names}</b></p>
                                                <p id='white-text'>State: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.State}</b></p>
                                                <p id='white-text'>Status: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Status}</b></p>
                                                <p id='white-text'>ID: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Id}</b></p>
                                                <p id='white-text'>Image: <b style={{ color: 'rgb(255, 99, 132)' }}>{item.Image}</b></p>
                                            </div>
                                            <div class="card-action">
                                                <Link to="/containerdata" style={{ color: 'rgb(255, 99, 132)' }}
                                                    state={{
                                                        idContainer: item.Id,
                                                        domainName: domainName,
                                                        nickname: nickname
                                                    }}>View
                                                    details</Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div></div>
                                )
                            }

                        })
                    }
                </div >
            )
        }

    }

    const renderAll = () => {
        console.log(data)
        if (data.length != 0) {
            return (
                <div>
                    {
                        data.map(item => {
                            if (item.State == 'running') {
                                return (
                                    <div class="card horizontal">
                                        <div class="card-image">
                                        </div>
                                        <div class="card-stacked">
                                            <div class="card-content">
                                                <p id='white-text'>
                                                    Type:<b style={{ color: 'rgb(32,151,207)' }}> Container</b>
                                                </p>
                                                <p id='white-text'>Name: <b style={{ color: 'rgb(32,151,207)' }}> {item.Names}</b></p>
                                                <p id='white-text'>State: <b id='green-text'> {item.State}</b></p>
                                                <p id='white-text'>Status: <b id='green-text'> {item.Status}</b></p>
                                                <p id='white-text'>ID: <b style={{ color: 'rgb(32,151,207)' }}> {item.Id}</b></p>
                                                <p id='white-text'>Image: <b style={{ color: 'rgb(32,151,207)' }}>{item.Image}</b></p>
                                            </div>
                                            <div class="card-action">
                                                <Link to="/containerdata" style={{ color: 'rgb(32, 151, 207)' }}
                                                    state={{
                                                        idContainer: item.Id,
                                                        domainName: domainName,
                                                        nickname: nickname
                                                    }}>View
                                                    details</Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div class="card horizontal">
                                        <div class="card-image">
                                        </div>
                                        <div class="card-stacked">
                                            <div class="card-content">
                                                <p id='white-text'>
                                                    Type:<b style={{ color: 'rgb(255, 99, 132)' }}> Container</b>
                                                </p>
                                                <p id='white-text'>Name: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Names}</b></p>
                                                <p id='white-text'>State: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.State}</b></p>
                                                <p id='white-text'>Status: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Status}</b></p>
                                                <p id='white-text'>ID: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Id}</b></p>
                                                <p id='white-text'>Image: <b style={{ color: 'rgb(255, 99, 132)' }}>{item.Image}</b></p>
                                            </div>
                                            <div class="card-action">
                                                <Link to="/containerdata" style={{ color: 'rgb(255, 99, 132)' }}
                                                    state={{
                                                        idContainer: item.Id,
                                                        domainName: domainName,
                                                        nickname: nickname
                                                    }}>View
                                                    details</Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        })
                    }
                </div >
            )
        }

    }


    useInterval(() => {
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
                let counter_running = 0
                let counter_exited = 0
                for (let i = 0; i < result.containers.length; i++) {
                    if (result.containers[i].State == 'running') {
                        counter_running++
                    }
                    if (result.containers[i].State == 'exited') {
                        counter_exited++
                    }
                }
                setRunningCount(counter_running)
                setExitedCount(counter_exited)
                console.log(runningCount)
                console.log(exitedCount)
            })
    }, isRunning ? delay : null);




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
                let counter_running = 0
                let counter_exited = 0
                for (let i = 0; i < result.containers.length; i++) {
                    if (result.containers[i].State == 'running') {
                        counter_running++
                    }
                    if (result.containers[i].State == 'exited') {
                        counter_exited++
                    }
                }
                setRunningCount(counter_running)
                setExitedCount(counter_exited)
                console.log(runningCount)
                console.log(exitedCount)
                setLoading(true)
            })
    }, [])

    return (
        <>
            {
                loading ? (<div style={{
                    background: "rgb(40,44,52)",
                    minHeight: '150vh',
                    overflow: 'auto'
                }}>
                    <div class="col s12 m7" style={{
                        margin: "50px auto",
                        maxWidth: "900px",
                        textAlign: "center"
                    }}>
                        <div style={{ display: 'flex', width: '50%', margin: '0 auto', gap: '30px' }}>
                            {
                                selectedRunning ? (
                                    <>
                                        <div class="circle-selected" onClick={() => seeRunning()}>
                                            <div style={{ marginTop: '40px' }}><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>{runningCount}</b></div>
                                            <div><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>running</b></div>
                                        </div>
                                        <div class="circle-red" onClick={() => seeExited()}>
                                            <div style={{ marginTop: '40px' }}><b class="text-red">{exitedCount}</b></div>
                                            <div><b class="text-red">exited</b></div>
                                        </div>
                                    </>)
                                    : (
                                        <>
                                            {
                                                selectedExit ? (<><div class="circle" onClick={() => seeRunning()}>
                                                    <div style={{ marginTop: '40px' }}><b class="text">{runningCount}</b></div>
                                                    <div><b class="text">running</b></div>
                                                </div>
                                                    <div class="circle-red-selected" onClick={() => seeExited()}>
                                                        <div style={{ marginTop: '40px' }}><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>{exitedCount}</b></div>
                                                        <div><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>exited</b></div>
                                                    </div></>)

                                                    : (<><div class="circle" onClick={() => seeRunning()}>
                                                        <div style={{ marginTop: '40px' }}><b class="text">{runningCount}</b></div>
                                                        <div><b class="text">running</b></div>
                                                    </div>
                                                        <div class="circle-red" onClick={() => seeExited()}>
                                                            <div style={{ marginTop: '40px' }}><b class="text-red">{exitedCount}</b></div>
                                                            <div><b class="text-red">exited</b></div>
                                                        </div></>)
                                            }


                                        </>)

                            }

                        </div>
                        <br></br>

                        <div>

                            {
                                selectedRunning ? (<div>{renderRunning()}</div>) : (<div>{selectedExit ? (<div>{renderExited()}</div>) : (<div>{renderAll()}</div>)}</div>)
                            /* <div>
                                            <div class="card horizontal">
                                                <div class="card-image">
                                                </div>
                                                <div class="card-stacked">
                                                    <div class="card-content">

                                                        {
                                                            item.State === "running" ?
                                                                (<div><p id='white-text'>
                                                                    Type:<b style={{ color: 'rgb(32,151,207)' }}> Container</b>
                                                                </p>
                                                                    <p id='white-text'>Name: <b style={{ color: 'rgb(32,151,207)' }}> {item.Names}</b></p></div>) : (<div><p id='white-text'>
                                                                        Type:<b style={{ color: 'rgb(255, 99, 132)' }}> Container</b>
                                                                    </p>
                                                                        <p id='white-text'>Name: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Names}</b></p></div>)
                                                        }
                                                        {
                                                            item.State === 'running' ?
                                                                (<div>
                                                                    <p id='white-text'>State: <b id='green-text'> {item.State}</b></p>
                                                                    <p id='white-text'>Status: <b id='green-text'> {item.Status}</b></p>
                                                                    <p id='white-text'>ID: <b style={{ color: 'rgb(32,151,207)' }}> {item.Id}</b></p>
                                                                    <p id='white-text'>Image: <b style={{ color: 'rgb(32,151,207)' }}>{item.Image}</b></p>
                                                                </div>)
                                                                : (<div>
                                                                    <p id='white-text'>State: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.State}</b></p>
                                                                    <p id='white-text'>Status: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Status}</b></p>
                                                                    <p id='white-text'>ID: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Id}</b></p>
                                                                    <p id='white-text'>Image: <b style={{ color: 'rgb(255, 99, 132)' }}>{item.Image}</b></p>
                                                                </div>)
                                                        }


                                                    </div>

                                                    {
                                                        item.State === 'running' ?
                                                            (<div class="card-action">
                                                                <Link to="/containerdata" style={{ color: 'rgb(32, 151, 207)' }}
                                                                    state={{
                                                                        idContainer: item.Id,
                                                                        domainName: domainName,
                                                                        nickname: nickname
                                                                    }}>View
                                                                    details</Link>
                                                            </div>) : (<div class="card-action">
                                                                <Link to="/containerdata" style={{ color: 'rgb(255, 99, 132)' }}
                                                                    state={{
                                                                        idContainer: item.Id,
                                                                        domainName: domainName,
                                                                        nickname: nickname
                                                                    }}>View
                                                                    details</Link>
                                                            </div>)
                                                    }




                                                </div>
                                            </div>


                                        </div> */}
                        </div>



                    </div>
                </div >) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)

            }
        </>

    )

}

export default ClusterInfo