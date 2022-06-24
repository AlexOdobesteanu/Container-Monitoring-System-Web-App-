import React, { useEffect, useRef, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import { useNavigate } from 'react-router-dom'
import { Parallax, Background } from 'react-parallax';
import { HashLoader } from 'react-spinners';
import FmdBadIcon from '@mui/icons-material/FmdBad'
import M from 'materialize-css'
import { Button } from 'react-materialize'
import ConfirmDialog from './ConfirmDialog'

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

const Notification = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const [isRunning, setIsRunning] = useState(true)
    const [delay, setDelay] = useState(4000)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })


    const ViewCluster = (idCluster) => {
        fetch("/GetClusterDetailsById", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    idCluster: idCluster
                }
            )
        }).then(res => res.json())
            .then(result => {
                console.log(result.mycluster[0])
                navigate('/nodes', {
                    state: {
                        idCluster: idCluster,
                        domainName: result.mycluster[0].domainName,
                        nickname: result.mycluster[0].nickname
                    }
                })
            })


    }


    const handleDelete = (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        fetch("/AlertsNotificationsDelete", {
            method: "delete",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: id
                }
            )
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(data.filter(item => item._id != result._id))
                console.log(data)

                M.toast({ html: "Successfully deleted", classes: 'rounded green' })
            })
    }

    useEffect(() => {
        fetch("/AlertsNotifications", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result.myalertnotifications)

                setData(result.myalertnotifications)
                setLoading(true)
            })

    }, [])

    useInterval(() => {
        fetch("/AlertsNotifications", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.myalertnotifications)
            })





    }, isRunning ? delay : null);

    let y_labels = { 0: "stopped", 1: "running", 2: "stopped" }

    return (

        <>
            <div style={{ textAlign: 'center' }}><b id='white-text' style={{ fontSize: '20px', fontStyle: 'italic' }}>Notifications Menu</b></div>
            {loading ? (<div style={{ marginLeft: '190px', marginRight: '190px' }}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        data.map(item => {
                            return (
                                <>


                                    <div class="card horizontal" key={item._id} style={{ flex: '1 1 0px' }}>
                                        <div class="card-stacked">
                                            <div class="card-content">
                                                <b className='white-text' >Alert Type: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.TypeOfNotification}</b></b>
                                                <br></br>

                                                <b className='white-text' >Alert Message: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.Message}</b></b>
                                                <br></br>
                                                <br></br>
                                                <b className='white-text' >Cluster ID: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.idCluster}</b></b>
                                                <br></br>
                                                <b className='white-text' >Cluster Name: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.ClusterName}</b></b>
                                                <br></br>
                                                <br></br>
                                                <b className='white-text' >Node ID: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.NodeId}</b></b>
                                                <br></br>
                                                <b className='white-text' >Node Name: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.NodeName}</b></b>
                                                <br></br>
                                                <br></br>

                                                <b className='white-text' >Container ID: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.idContainer}</b></b>
                                                <br></br>
                                                <b className='white-text' >Container Name: <b style={{ color: 'rgb(255, 99, 132)' }}> {item.ContainerName}</b></b>
                                                <div>
                                                    {

                                                    }
                                                </div>




                                                {/* <>
                                                    {
                                                        item.TypeOfNotification != "Container Status Changed (Stopped)" ? <></> : <><b className='white-text' >Date of Alert: <b style={{ color: 'rgb(255, 99, 132)' }}>{new Date(item.DateOfNotification).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></b></>
                                                    }
                                                </> */}


                                            </div>
                                            <Button style={{
                                                backgroundColor: 'rgb(62, 68, 82)', border: '3px solid rgb(62, 68, 82)'
                                            }} onClick={() => ViewCluster(item.idCluster)}>View Cluster</Button>

                                            <>
                                                {
                                                    item.TypeOfNotification != "Container Status Changed (Stopped)" ? <div class='card-action' style={{ marginBottom: '32px' }}>
                                                        <div style={{ width: '500px', height: '200px', textAlign: 'center', margin: '0px auto' }}>
                                                            <Line data={{
                                                                labels: ["", new Date(item.DateOfNotification).toUTCString([], { hour: '2-digit', minute: '2-digit' }).toString(), ""],
                                                                datasets: [{
                                                                    label: item.Message,
                                                                    fill: true,
                                                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                                                    pointBorderColor: 'white',
                                                                    pointBorderWidth: 3,
                                                                    pointRadius: 3,
                                                                    tension: 0.4,
                                                                    borderColor: 'rgb(255, 99, 132)',
                                                                    data: [0, parseFloat(item.ValueOver).toFixed(3).toString(), 0]
                                                                },
                                                                {

                                                                    label: 'Threshold set',
                                                                    fill: true,
                                                                    backgroundColor: 'rgba(255, 205, 86, 0.2)',
                                                                    pointBorderColor: 'white',
                                                                    pointBorderWidth: 3,
                                                                    pointRadius: 3,
                                                                    tension: 0.4,
                                                                    borderColor: 'rgb(76, 175, 80)',
                                                                    data: [item.ValueSetByUser, item.ValueSetByUser, item.ValueSetByUser]
                                                                }
                                                                ]
                                                            }} options={{
                                                                plugins: {  // 'legend' now within object 'plugins {}'
                                                                    legend: {
                                                                        labels: {
                                                                            color: "white",  // not 'fontColor:' anymore
                                                                            // fontSize: 18  // not 'fontSize:' anymore
                                                                            font: {
                                                                                size: 15 // 'size' now within object 'font {}'
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                scales: {

                                                                    x: {

                                                                        ticks: {
                                                                            color: 'white'
                                                                        },
                                                                        grid: {
                                                                            color: 'rgb(40,44,52)',
                                                                            borderColor: 'white'
                                                                        }
                                                                    },
                                                                    y: {
                                                                        ticks: {
                                                                            color: 'white'
                                                                        },
                                                                        grid: {
                                                                            color: 'rgb(40,44,52)',
                                                                            borderColor: 'white'
                                                                        }
                                                                    },
                                                                }
                                                            }} />
                                                        </div>
                                                    </div> :
                                                        <div style={{ marginBottom: '32px' }}>
                                                            <div style={{ width: '500px', height: '200px', textAlign: 'center', margin: '0px auto' }}>
                                                                <Line data={{
                                                                    labels: ["", "", new Date(item.DateOfNotification).toUTCString([], { hour: '2-digit', minute: '2-digit' }).toString(), ""],
                                                                    datasets: [{
                                                                        label: "status",
                                                                        fill: true,
                                                                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                                                        pointBorderColor: 'white',
                                                                        pointBorderWidth: 3,
                                                                        pointRadius: 3,
                                                                        tension: 0.4,
                                                                        borderColor: 'rgb(255, 99, 132)',
                                                                        data: [1, 1, 0, 0]
                                                                    }
                                                                    ]
                                                                }} options={{
                                                                    plugins: {  // 'legend' now within object 'plugins {}'
                                                                        legend: {
                                                                            labels: {
                                                                                color: "white",  // not 'fontColor:' anymore
                                                                                // fontSize: 18  // not 'fontSize:' anymore
                                                                                font: {
                                                                                    size: 15 // 'size' now within object 'font {}'
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    scales: {

                                                                        x: {

                                                                            ticks: {
                                                                                color: 'white'
                                                                            },
                                                                            grid: {
                                                                                color: 'rgb(40,44,52)',
                                                                                borderColor: 'white'
                                                                            }
                                                                        },
                                                                        y: {
                                                                            ticks: {
                                                                                callback: function (value, index, values) {
                                                                                    return y_labels[value]
                                                                                },
                                                                                color: 'white'
                                                                            },
                                                                            grid: {
                                                                                color: 'rgb(40,44,52)',
                                                                                borderColor: 'white'
                                                                            }
                                                                        },
                                                                    }
                                                                }} />

                                                            </div>
                                                        </div>
                                                }
                                            </>

                                        </div>
                                        <h5>
                                            <i className="small material-icons white-text " style={{ position: "absolute", top: '0', right: 0, cursor: 'default' }} onClick={() => {
                                                // handleDelete(item._id)
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: 'Are you sure you want to delete this notification ?',
                                                    subtitle: "You can't undo this operation",
                                                    onConfirm: () => { handleDelete(item._id) }
                                                })
                                            }}>delete</i>
                                        </h5>
                                        <FmdBadIcon fontSize='large' style={{ color: 'rgb(255, 99, 132)', position: "absolute", top: '0', left: 0, cursor: 'default', fontSize: '50px' }}></FmdBadIcon>
                                    </div>



                                </>
                            )
                        })
                    }
                    <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}></ConfirmDialog>

                </div>

            </div>) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)
            }

        </>
    )

}

export default Notification