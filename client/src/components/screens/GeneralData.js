import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Doughnut } from 'react-chartjs-2'
import { Bar, Line } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import { color } from '@mui/system';
import { Button } from 'react-materialize';
import { HashLoader } from 'react-spinners';


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


const GeneralData = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const location = useLocation();

    const [res, setRes] = useState([])
    const [loading, setLoading] = useState(false)

    const [MemPercDataset, setMemPercDataset] = useState([])
    const [MemUsedDataset, setMemUsedDataset] = useState([])
    const [CacheDataset, setCacheDataset] = useState([])
    const [colors, setColors] = useState([])

    const [CpuPercDataset, setCpuPercDataset] = useState([])
    const [UserModeDataset, setUserModeDataset] = useState([])
    const [KernelModeDataset, setKernelModeDataset] = useState([])
    const [TxData, setTxData] = useState([])
    const [RxData, setRxData] = useState([])
    const [TxRxRateDataset, setTxRxRateDataset] = useState([])
    const [TxDroppedDataset, setTxDroppedDataset] = useState([])
    const [RxDroppedDataset, setRxDroppedDataset] = useState([])
    const [TxErrorsDataset, setTxErrorsDataset] = useState([])
    const [RxErrorsDataset, setRxErrorsDataset] = useState([])

    const idCluster = location.state.idCluster
    const domainName = location.state.domainName
    const nickname = location.state.nickname

    const [delay, setDelay] = useState(4000);
    const [isRunning, setIsRunning] = useState(false);

    const [Dates, setDates] = useState([])
    const [LiveStarted, setLiveStarted] = useState(false)

    const Startlive = () => {
        setIsRunning(true)
        setLiveStarted(true)
    }

    const Stoplive = () => {
        setIsRunning(false)
        setLiveStarted(false)

    }

    var dynamicColors = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        let color = []
        color[0] = "rgb(" + r + "," + g + "," + b + ")"
        color[1] = "rgb(" + r + "," + g + "," + b + ",0.1)"
        return color;
    };

    useEffect(() => {
        fetch("/getGeneralData", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster
            })
        }).then(res => res.json())
            .then(result => {

                console.log(result)




                let aux_memPerc = result.MemPercDataset
                let aux_memUsed = result.MemUsedDataset
                let aux_cache = result.CacheDataset
                let aux_cpuPerc = result.CpuPercDataset
                let aux_userMode = result.UserModeDataset
                let aux_kernelMode = result.KernelModeDataset
                let aux_TxData = result.TxData
                let aux_RxData = result.RxData
                let aux_TxRxRate = result.TxRxRateDataset
                let aux_TxDropped = result.TxDroppedDataset
                let aux_RxDropped = result.RxDroppedDataset
                let aux_TxErrors = result.TxErrorsDataset
                let aux_RxErrors = result.RxErrorsDataset

                for (let i = 0; i < result.MemPercDataset.length; i++) {
                    let color_aux = dynamicColors()
                    setColors(colors => [...colors, [color_aux[0], color_aux[1]]])


                    aux_memPerc[i]['backgroundColor'] = color_aux[1]
                    aux_memPerc[i]['borderColor'] = color_aux[0]

                    aux_memUsed[i]['backgroundColor'] = color_aux[1]
                    aux_memUsed[i]['borderColor'] = color_aux[0]

                    aux_cache[i]['backgroundColor'] = color_aux[1]
                    aux_cache[i]['borderColor'] = color_aux[0]

                    aux_cpuPerc[i]['backgroundColor'] = color_aux[1]
                    aux_cpuPerc[i]['borderColor'] = color_aux[0]

                    aux_userMode[i]['backgroundColor'] = color_aux[1]
                    aux_userMode[i]['borderColor'] = color_aux[0]

                    aux_kernelMode[i]['backgroundColor'] = color_aux[1]
                    aux_kernelMode[i]['borderColor'] = color_aux[0]

                    aux_TxData[i]['backgroundColor'] = color_aux[1]
                    aux_TxData[i]['borderColor'] = color_aux[0]

                    aux_RxData[i]['backgroundColor'] = color_aux[1]
                    aux_RxData[i]['borderColor'] = color_aux[0]

                    aux_TxRxRate[i]['backgroundColor'] = color_aux[1]
                    aux_TxRxRate[i]['borderColor'] = color_aux[0]

                    aux_TxDropped[i]['backgroundColor'] = color_aux[1]
                    aux_TxDropped[i]['borderColor'] = color_aux[0]

                    aux_RxDropped[i]['backgroundColor'] = color_aux[1]
                    aux_RxDropped[i]['borderColor'] = color_aux[0]

                    aux_TxErrors[i]['backgroundColor'] = color_aux[1]
                    aux_TxErrors[i]['borderColor'] = color_aux[0]

                    aux_RxErrors[i]['backgroundColor'] = color_aux[1]
                    aux_RxErrors[i]['borderColor'] = color_aux[0]
                }

                setMemPercDataset(aux_memPerc)
                setMemUsedDataset(aux_memUsed)
                setCacheDataset(aux_cache)
                setCpuPercDataset(aux_cpuPerc)
                setUserModeDataset(aux_userMode)
                setKernelModeDataset(aux_kernelMode)
                setTxData(aux_TxData)
                setRxData(aux_RxData)
                setTxRxRateDataset(aux_TxRxRate)
                setTxDroppedDataset(aux_TxDropped)
                setRxDroppedDataset(aux_RxDropped)
                setTxErrorsDataset(aux_TxErrors)
                setRxErrorsDataset(aux_RxErrors)
                setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))
                setLoading(true)

            })


    }, [])

    useInterval(() => {
        fetch("/getGeneralData", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster
            })
        }).then(res => res.json())
            .then(result => {





                let aux_memPerc = result.MemPercDataset
                let aux_memUsed = result.MemUsedDataset
                let aux_cache = result.CacheDataset
                let aux_cpuPerc = result.CpuPercDataset
                let aux_userMode = result.UserModeDataset
                let aux_kernelMode = result.KernelModeDataset
                let aux_TxData = result.TxData
                let aux_RxData = result.RxData
                let aux_TxRxRate = result.TxRxRateDataset
                let aux_TxDropped = result.TxDroppedDataset
                let aux_RxDropped = result.RxDroppedDataset
                let aux_TxErrors = result.TxErrorsDataset
                let aux_RxErrors = result.RxErrorsDataset

                for (let i = 0; i < result.MemPercDataset.length; i++) {
                    // let color_aux = dynamicColors()
                    // setColors(colors => [...colors, [color_aux[0], color_aux[1]]])


                    aux_memPerc[i]['backgroundColor'] = colors[i][1]
                    aux_memPerc[i]['borderColor'] = colors[i][0]

                    aux_memUsed[i]['backgroundColor'] = colors[i][1]
                    aux_memUsed[i]['borderColor'] = colors[i][0]

                    aux_cache[i]['backgroundColor'] = colors[i][1]
                    aux_cache[i]['borderColor'] = colors[i][0]

                    aux_cpuPerc[i]['backgroundColor'] = colors[i][1]
                    aux_cpuPerc[i]['borderColor'] = colors[i][0]

                    aux_userMode[i]['backgroundColor'] = colors[i][1]
                    aux_userMode[i]['borderColor'] = colors[i][0]

                    aux_kernelMode[i]['backgroundColor'] = colors[i][1]
                    aux_kernelMode[i]['borderColor'] = colors[i][0]

                    aux_TxData[i]['backgroundColor'] = colors[i][1]
                    aux_TxData[i]['borderColor'] = colors[i][0]

                    aux_RxData[i]['backgroundColor'] = colors[i][1]
                    aux_RxData[i]['borderColor'] = colors[i][0]

                    aux_TxRxRate[i]['backgroundColor'] = colors[i][1]
                    aux_TxRxRate[i]['borderColor'] = colors[i][0]

                    aux_TxDropped[i]['backgroundColor'] = colors[i][1]
                    aux_TxDropped[i]['borderColor'] = colors[i][0]

                    aux_RxDropped[i]['backgroundColor'] = colors[i][1]
                    aux_RxDropped[i]['borderColor'] = colors[i][0]

                    aux_TxErrors[i]['backgroundColor'] = colors[i][1]
                    aux_TxErrors[i]['borderColor'] = colors[i][0]

                    aux_RxErrors[i]['backgroundColor'] = colors[i][1]
                    aux_RxErrors[i]['borderColor'] = colors[i][0]
                }
                console.log("alex")

                setMemPercDataset(aux_memPerc)
                setMemUsedDataset(aux_memUsed)
                setCacheDataset(aux_cache)
                setCpuPercDataset(aux_cpuPerc)
                setUserModeDataset(aux_userMode)
                setKernelModeDataset(aux_kernelMode)
                setTxData(aux_TxData)
                setRxData(aux_RxData)
                setTxRxRateDataset(aux_TxRxRate)
                setTxDroppedDataset(aux_TxDropped)
                setRxDroppedDataset(aux_RxDropped)
                setTxErrorsDataset(aux_TxErrors)
                setRxErrorsDataset(aux_RxErrors)
                setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))

            })





    }, isRunning ? delay : null);


    return (
        <div>
            {
                loading ? <div style={{ overflow: 'hidden', height: '6500px' }}>
                    <div style={{ textAlign: "center" }}>
                        <b id='white-text' style={{ fontSize: '30px', fontStyle: 'italic' }}>General Data for Cluster</b>
                        <br></br>
                        <b id='white-text' style={{ fontSize: '30px', fontStyle: 'italic' }}>with nickname <b id='blue-text' style={{ fontSize: '30px' }}>{nickname}</b></b>
                        <br></br>
                        <div>
                            {LiveStarted ? <><Button id='blue-button' onClick={() => Stoplive()} style={{ marginTop: '30px' }}>Stop RealTime</Button><br></br><b id='white-text' style={{ fontSize: '15px' }}>RealTime Data showing...</b>
                            </> : <><Button id='blue-button' onClick={() => Startlive()} style={{ marginTop: '30px' }}>View RealTime Data</Button></>}

                        </div>

                    </div>


                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '100px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '60px', marginLeft: '100px'
                    }}>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: MemPercDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'MEMORY USAGE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar data={{
                                labels: Dates,
                                datasets: MemUsedDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'MEMORY USED (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar data={{
                                labels: Dates,
                                datasets: CacheDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'CACHE (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>

                    </div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '100px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '200px', marginLeft: '100px'
                    }}>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: CpuPercDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'CPU PERCENTAGE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />


                        </div>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: UserModeDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'USER MODE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: KernelModeDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'KERNEL MODE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>



                    </div>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '150px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '200px', marginLeft: '100px'
                    }}>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar data={{
                                labels: Dates,
                                datasets: TxData
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX Data (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar data={{
                                labels: Dates,
                                datasets: RxData
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'RX Data (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar data={{
                                labels: Dates,
                                datasets: TxRxRateDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX/RX RATE',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                            }} height={250} />
                        </div>

                    </div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '150px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '200px', marginLeft: '100px'
                    }}>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: TxDroppedDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX PACKETS DROPPED',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: RxDroppedDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'RX PACKETS DROPPED',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: TxErrorsDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX PACKETS ERRORS',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line data={{
                                labels: Dates,
                                datasets: RxErrorsDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'RX PACKETS ERRORS',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
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
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                    </div>

                </div> : <div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>
            }
        </div>


    )

}

export default GeneralData