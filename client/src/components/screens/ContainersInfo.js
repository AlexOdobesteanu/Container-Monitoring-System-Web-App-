import React, {useState, useEffect, useRef} from 'react'
import {useLocation, useNavigate} from 'react-router-dom';
import M from 'materialize-css'
import {} from 'chart.js'
import {Line} from 'react-chartjs-2'


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
    const [data, setData] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    // console.log(location.state.user)
    const idContainer = location.state.idContainer;
    const username = location.state.user;
    const password = location.state.password;
    const host = location.state.host;


    let [count, setCount] = useState(0);
    const [delay, setDelay] = useState(1000);
    const [isRunning, setIsRunning] = useState(false);

    useInterval(() => {

        // setCount(count + 1);
        // console.log(count);
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
    }, [])

    const showGraph = () => {
        setIsRunning(true)
        M.toast({html: "Live Monitoring Running", classes: 'rounded green', displayLength: "null"})

    }
    const StopShowGraph = () => {
        setIsRunning(false)
        M.Toast.dismissAll();
        M.toast({html: "Live Monitoring Stopped", classes: 'rounded red darken-3'});

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
                                        <p>
                                            Type: Container
                                        </p>
                                        <p>IP Address: {item.host}</p>
                                        <p>Username for Container: {item.username}</p>
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

                            </div>
                        </div>

                    )
                })
            }

        </div>

    )
}

export default ContainersInfo