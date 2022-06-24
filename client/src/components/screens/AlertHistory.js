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
import { Collapsible, CollapsibleItem, Icon, TextInput, Button, Modal, Checkbox } from 'react-materialize'
import ConfirmDialog from './ConfirmDialog'
import { Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography';

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

const AlertHistory = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const [loading, setLoading] = useState(false)
    const [Data, setData] = useState([])
    const [unDates, setUnDates] = useState([])
    const [notific, setNotific] = useState([])
    const [modalData, setModalData] = useState([])


    const renderNot = (list) => {
        return (
            list.map(item => {
                <b id='white-text'> lista</b>

            })
        )

    }
    useEffect(() => {
        fetch("/GetAlertsHistory", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(result => {

                setData(result.resp)
                // setUnDates(result.un)
                console.log(result.resp)

                for (let i = 0; i < result.resp.length; i++) {
                    setUnDates(unDates => [...unDates, result.resp[i][0]])
                    setNotific(notific => [...notific, result.resp[i][1].length.toString()])
                }
                setLoading(true)

            })

    }, [])

    let y_labels = { 0: "stopped", 1: "running", 2: "stopped" }



    return (
        <div style={{
            textAlign: "center"
        }}>
            <b id='white-text' style={{ fontStyle: 'italic', fontSize: '30px' }}>Alert History</b>
            {
                loading ? <div class="col s12 m7" style={{
                    margin: "50px auto",
                    maxWidth: "1100px",
                    textAlign: "center"
                }} >
                    <div style={{
                        margin: "50px auto",
                        maxWidth: "650px",
                        textAlign: "center"
                    }}>
                        <Line
                            data={{
                                labels: unDates,
                                datasets: [{
                                    label: "Alerts",
                                    fill: true,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    pointBorderColor: 'white',
                                    pointBorderWidth: 3,
                                    pointRadius: 3,
                                    tension: 0.4,
                                    borderColor: 'rgb(255, 99, 132)',
                                    data: notific
                                },
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

                    <Collapsible popout>
                        {
                            Data.map((item) => {
                                return (
                                    <CollapsibleItem
                                        expanded={false}
                                        header={item[0]}
                                        icon={<Icon>date_range</Icon>}
                                        node="div"
                                    >
                                        <div>
                                            <b id='white-text' style={{ fontSize: '20px' }}>Total Alerts:</b><b style={{ fontSize: '30px', color: 'red' }}> {Object.keys(item[1]).length}</b>
                                        </div>

                                        {

                                            item[1].map((item2) => {
                                                return (
                                                    <>
                                                        <div style={{ border: "2px solid rgb(62, 68, 82)" }}>
                                                            <div>
                                                                <b>Date: <b id='green-text'>{new Date(item2["DateOfNotification"]).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></b>
                                                                <Modal
                                                                    actions={[
                                                                        <div id='modal-bottom'>
                                                                            <Button flat modal="close" node="button" waves="green" id='red-button'>Close</Button>
                                                                        </div>
                                                                    ]}
                                                                    bottomSheet={false}
                                                                    fixedFooter={false}
                                                                    header="Alert details"
                                                                    id="Modal-10"
                                                                    open={false}
                                                                    options={{
                                                                        dismissible: true,
                                                                        endingTop: '10%',
                                                                        inDuration: 250,
                                                                        onCloseEnd: null,
                                                                        onCloseStart: null,
                                                                        onOpenEnd: null,
                                                                        onOpenStart: null,
                                                                        opacity: 0.5,
                                                                        outDuration: 250,
                                                                        preventScrolling: false,
                                                                        startingTop: '4%'
                                                                    }}
                                                                    trigger={
                                                                        <Tooltip title={<Typography fontSize={15}>View More</Typography>}>
                                                                            <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: 'relative', float: 'right' }}>more</i>
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <div style={{ display: 'flex', gap: '50px' }}>
                                                                        <div style={{ flex: '1 1 0px' }}>
                                                                            <b>Alert Type:<b style={{ color: 'red' }}> {item2["TypeOfNotification"]}</b></b>
                                                                            <br></br>
                                                                            <b>Message: <b style={{ color: 'red' }}>{item2["Message"]}</b></b>
                                                                        </div>
                                                                        <div style={{ flex: '1 1 0px' }}>
                                                                            <b id='white-text'>Cluster ID:</b><b style={{ color: 'red' }}> {item2["idCluster"]}</b>
                                                                            <br></br>
                                                                            <b>Cluster Name: <b style={{ color: 'red' }}>{item2["ClusterName"]}</b></b>
                                                                            <br></br>
                                                                            <br></br>
                                                                            <b id='white-text'>Node ID:</b><b style={{ color: 'red' }}> {item2["NodeId"]}</b>
                                                                            <br></br>
                                                                            <b>Node Name: <b style={{ color: 'red' }}>{item2["NodeName"]}</b></b>
                                                                        </div>
                                                                        <div style={{ flex: '1 1 0px' }}>
                                                                            <b id='white-text'>Container ID:</b><b style={{ color: 'red' }}> {item2["idContainer"].slice(0, 12)}</b>
                                                                            <br></br>
                                                                            <b>Container Name: <b style={{ color: 'red' }}>{item2["ContainerName"]}</b></b>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <b>Date: <b id='green-text'>{new Date(item2["DateOfNotification"]).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></b>
                                                                        <br></br>
                                                                    </div>

                                                                    <br></br>
                                                                    <br></br>

                                                                    <div style={{ borderTop: "4px solid rgb(62, 68, 82)" }}>
                                                                        {
                                                                            item2.TypeOfNotification != "Container Status Changed (Stopped)" ? <div class='card-action' style={{ marginBottom: '32px' }}>
                                                                                <div style={{ width: '500px', height: '200px', textAlign: 'center', margin: '0px auto' }}>
                                                                                    <Line data={{
                                                                                        labels: ["", new Date(item2["DateOfNotification"]).toUTCString([], { hour: '2-digit', minute: '2-digit' }).toString(), ""],
                                                                                        datasets: [{
                                                                                            label: item2["Message"],
                                                                                            fill: true,
                                                                                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                                                                            pointBorderColor: 'white',
                                                                                            pointBorderWidth: 3,
                                                                                            pointRadius: 3,
                                                                                            tension: 0.4,
                                                                                            borderColor: 'rgb(255, 99, 132)',
                                                                                            data: [0, parseFloat(item2["ValueOver"]).toFixed(3).toString(), 0]
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
                                                                                            data: [item2["ValueSetByUser"], item2["ValueSetByUser"], item2["ValueSetByUser"]]
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
                                                                                            labels: ["", "", new Date(item2["DateOfNotification"]).toUTCString([], { hour: '2-digit', minute: '2-digit' }).toString(), ""],
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
                                                                    </div>


                                                                </Modal>
                                                            </div>



                                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                                <div style={{ flex: '1 1 0px' }}>
                                                                    <b>Alert Type:<b style={{ color: 'red' }}> {item2["TypeOfNotification"]}</b></b>
                                                                    {/* <br></br>
                                                                    <b>Message: <b style={{ color: 'red' }}>{item2["Message"]}</b></b> */}
                                                                </div>
                                                                <div style={{ flex: '1 1 0px' }}>
                                                                    {/* <b id='white-text'>Cluster ID:</b><b style={{ color: 'red' }}> {item2["idCluster"]}</b>
                                                                    <br></br> */}
                                                                    <b>Cluster Name: <b style={{ color: 'red' }}>{item2["ClusterName"]}</b></b>
                                                                    <br></br>
                                                                    <b>Node Name: <b style={{ color: 'red' }}>{item2["NodeName"]}</b></b>

                                                                </div>
                                                                <div style={{ flex: '1 1 0px' }}>
                                                                    {/* <b id='white-text'>Container ID:</b><b style={{ color: 'red' }}> {item2["idContainer"].slice(0, 12)}</b>
                                                                    <br></br> */}
                                                                    <b>Container Name: <b style={{ color: 'red' }}>{item2["ContainerName"]}</b></b>

                                                                </div>
                                                            </div>




                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </CollapsibleItem>
                                )
                            })
                        }

                    </Collapsible>
                </div> : <div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>
            }

        </div >
    )

}

export default AlertHistory