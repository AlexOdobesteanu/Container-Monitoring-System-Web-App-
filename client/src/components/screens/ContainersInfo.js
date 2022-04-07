import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import M from 'materialize-css'
import { } from 'chart.js'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { Bar, Line } from 'react-chartjs-2'
import { setsEqual } from "chart.js/helpers";
import { parseInteger } from "luxon/src/impl/util.js";
import { HashLoader } from 'react-spinners';
import "../../App.css"


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

const ContainersInfo = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    let arr = []
    let arr_2 = []
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [GraphData, setGraphData] = useState([])
    const [counterData, setCounterData] = useState([])
    const [myData, setMyData] = useState([]);
    const [allcpu, setallCpu] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    // console.log(location.state.user)
    const idContainer = location.state.idContainer;
    const username = location.state.user;
    const password = location.state.password;


    const host = location.state.host;
    const [cpuGraph, setCpuGraph] = useState(false);


    let [count, setCount] = useState(0);

    const [delay, setDelay] = useState(4000);
    const [isRunning, setIsRunning] = useState(false);

    const [delay_2, setDelay_2] = useState(5000);
    const [isRunning_2, setIsRunning_2] = useState(false);

    useInterval(() => {
        fetch("/cpu", {
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                forContainer: idContainer,
                username: username,
                password: password,
                host: host
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
            })

        fetch("/allcpu", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                forContainer: idContainer
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result.mycpu)
                setallCpu(result.mycpu)
                for (let i = 0; i < result.mycpu.length; i++) {
                    arr.push(parseFloat(result.mycpu[i].usePercentage.substring(0, result.mycpu[i].usePercentage.length - 4)))
                    arr_2.push(i)
                }
                console.log("aaa");
                //console.log(arr)
                setGraphData(arr)
                setCounterData(arr_2)
                //console.log(GraphData)

            })





        setCount(count + 1);
        console.log(count);
        // var spawn = require('child_process').spawn;
        // const pythonProcess = spawn('python', ["script.py", host, username, password])
        // pythonProcess.stdout.on('data', (data) => {
        //     console.log(data)
        // })
    }, isRunning ? delay : null);



    useEffect(() => {
        fetch("/info", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idContainer: idContainer
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result.mycontainerInfo)
                setData(result.mycontainerInfo)
            })
        fetch("/allcpu", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                forContainer: idContainer
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result.mycpu)
                setallCpu(result.mycpu)
                for (let i = 0; i < result.mycpu.length; i++) {
                    // if (parseFloat(result.mycpu[i].usePercentage.substring(0, result.mycpu[i].usePercentage.length - 4)) > parseFloat(0.6)) {
                    //     M.toast({ html: 'Overheated cpu', classes: 'rounded red darken-3' })
                    // }
                    arr.push(parseFloat(result.mycpu[i].usePercentage.substring(0, result.mycpu[i].usePercentage.length - 4)))
                    arr_2.push(i)
                }
                console.log("aaa");
                console.log(arr)
                setGraphData(arr)
                setCounterData(arr_2)
                //console.log(GraphData)
                setLoading(true);
            })

    }, [])


    const showGraph = () => {

        setIsRunning(true)
        M.toast({ html: "Live Monitoring Running", classes: 'rounded green', displayLength: "null" })

        setCpuGraph(true);
    }
    const StopShowGraph = () => {
        setIsRunning(false)
        M.Toast.dismissAll();
        M.toast({ html: "Live Monitoring Stopped", classes: 'rounded red darken-3' });
        setCpuGraph(false);
        // clearInterval(x);
        // fetch("/cpu", {
        //     method: "post",
        //     headers:
        //         {
        //             "Content-Type": "application/json"
        //         },
        //     body: JSON.stringify({
        //         usePercentage: "2"
        //     })
        // }).then(res => res.json())
        //     .then(result => {
        //         console.log(result.message)
        //     })

    }


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
                                <div class="card horizontal" key={item._id}>
                                    <div class="card-image">
                                    </div>
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <p id='white-text'>
                                                Type: Container
                                            </p>
                                            <p id='white-text'>IP Address: {item.host}</p>
                                            <p id='white-text'>Username for Container: {item.username}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn waves-effect waves-light green" onClick={() => showGraph()}>
                                        Start Live Monitoring for {item.host}
                                    </button>
                                    <br>
                                    </br>
                                    <br>
                                    </br>
                                    <button className="btn waves-effect waves-light #c62828 red darken-3"
                                        onClick={() => StopShowGraph()}>
                                        Stop Live Monitoring for {item.host}
                                    </button>
                                    <br>
                                    </br>
                                    <br>
                                    </br>
                                    <br>
                                    </br>
                                    <br>
                                    </br>



                                </div>


                            </div>

                        )
                    })
                }

            </div>


            <div style={{
                height: 800,
                width: 800,
                position: 'absolute', left: '50%', top: '80%',
                transform: 'translate(-50%, -50%)'
            }}>
                {/* <br>
                </br>
                <br>
                </br>
                <br>
                </br>
                <br>
                </br> */}
                {loading ? (
                    <div>
                        <Line data={{
                            labels: counterData,
                            datasets: [{
                                label: 'CPU Usage %',
                                fill: true,
                                backgroundColor: '#2e4355',
                                pointBorderColor: '#8884d8',
                                pointBorderWidth: 3,
                                pointRadius: 5,
                                tension: 0.4,
                                borderColor: 'rgb(255,99,132,0,2)',
                                data: GraphData
                            }]
                        }} height={400} width={600} />
                        {/* <br></br>
                        <br></br>
                        <br></br>
                        <br></br> */}
                        <Bar data={{
                            labels: counterData,
                            datasets: [{
                                label: 'CPU Usage %',
                                fill: true,
                                backgroundColor: 'rgb(30,144,255)',
                                pointBorderColor: '#8884d8',
                                pointBorderWidth: 3,
                                pointRadius: 5,
                                tension: 0.4,
                                borderColor: 'rgb(255,99,132,0,2)',
                                data: GraphData
                            }]
                        }} height={400} width={600} />

                    </div>) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)}


            </div>
        </div>


    )
}

export default ContainersInfo