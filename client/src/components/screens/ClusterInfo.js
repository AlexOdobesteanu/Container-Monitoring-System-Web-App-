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
import { Collapsible, CollapsibleItem, Icon, TextInput, Button, Modal, Checkbox } from 'react-materialize'
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
    const [loadingModal, setLoadingModal] = useState(false)

    const [checkedMemory, setCheckedMemory] = useState(false);
    const [checkedCPU, setCheckedCPU] = useState(false);
    const [checkedNetwork, setCheckedNetwork] = useState(false);
    const [checkedStatus, setCheckedStatus] = useState(false);
    const [checkedDropped, setCheckedDropped] = useState(false);
    const [checkedError, setCheckedError] = useState(false)

    const [MemoryPerc, setMemoryPerc] = useState("")
    const [MemoryUsed, setMemoryUsed] = useState("")
    const [CacheUsed, setCacheUsed] = useState("")

    const [NetworkRate, setNetworkRate] = useState("")
    const [TxData, setTxData] = useState("")
    const [RxData, setRxData] = useState("")

    const [CpuPerc, setCpuPerc] = useState("")
    const [UserPerc, setUserPerc] = useState("")
    const [KernelPerc, setKernelPerc] = useState("")

    const [Services, setServices] = useState([])
    const [showServices, setShowServices] = useState(false)




    const [selectedRunning, setSelectedRunning] = useState(false);
    const [selectedExit, setSelectedExit] = useState(false);
    const [selectedPause, setSelectedPause] = useState(false)

    const [runningCount, setRunningCount] = useState(0);
    const [exitedCount, setExitedCount] = useState(0);
    const [pausedCount, setPausedCount] = useState(0)
    const [aux, setAux] = useState({})

    const [delay, setDelay] = useState(4000);
    const [data, setData] = useState([])
    const location = useLocation();


    const idCluster = location.state.idCluster
    const domainName = location.state.domainName
    const nickname = location.state.nickname

    const seeRunning = () => {
        setSelectedExit(false)
        setSelectedPause(false)
        setSelectedRunning(!selectedRunning)
        console.log(selectedRunning)
    }

    const seeExited = () => {
        setSelectedRunning(false)
        setSelectedPause(false)
        setSelectedExit(!selectedExit)
    }

    const seePaused = () => {
        setSelectedExit(false)
        setSelectedRunning(false)
        setSelectedPause(!selectedPause)
    }

    const renderServices = () => {
        fetch('/GetServices',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                console.log(result)
                setServices(result.containers)
                setShowServices(true)
            })
    }



    const startContainer = (id) => {
        fetch('/StartContainer',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {

                        idContainer: id,
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                else {
                    M.toast({ html: result.succes, classes: 'rounded green' })
                }
            })

    }

    const unpauseContainer = (id) => {
        fetch('/UnpauseContainer',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        idContainer: id,
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                else {
                    M.toast({ html: result.succes, classes: 'rounded green' })
                }
            })
    }

    const pauseContainer = (id) => {
        fetch('/PauseContainer',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        idContainer: id,
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                else {
                    M.toast({ html: result.succes, classes: 'rounded green' })
                }
            })
    }

    const stopContainer = (id) => {
        fetch('/StopContainer',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {

                        idContainer: id,
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                // console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                else {
                    M.toast({ html: result.succes, classes: 'rounded green' })
                }
            })

    }



    const execTrigger = (id) => {
        console.log(id)
        console.log(idCluster)
        setCheckedMemory(false)
        setCheckedCPU(false)
        setCheckedNetwork(false)
        setCheckedStatus(false)
        setCheckedDropped(false)
        setCheckedError(false)
        setMemoryPerc('')
        setMemoryUsed('')
        setCacheUsed('')

        setCpuPerc('')
        setUserPerc('')
        setKernelPerc('')

        setRxData('')
        setTxData('')
        setNetworkRate('')

        setCheckedStatus(false)
        setCheckedDropped(false)
        setCheckedError(false)
        fetch('/GetAlerts',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        idCluster: idCluster,
                        idContainer: id
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                // console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                else {
                    console.log(result.myalert.MemPercAlert)
                    setMemoryPerc(result.myalert.MemPercAlert)
                    setMemoryUsed(result.myalert.MemUsedAlert)
                    setCacheUsed(result.myalert.CacheAlert)

                    setCpuPerc(result.myalert.CpuPercAlert)
                    setUserPerc(result.myalert.UserModeAlert)
                    setKernelPerc(result.myalert.KernelModeAlert)

                    setRxData(result.myalert.RxDataAlert)
                    setTxData(result.myalert.TxDataAlert)
                    setNetworkRate(result.myalert.TxRxRateAlert)

                    setCheckedStatus(result.myalert.StatusChangeAlert)
                    setCheckedDropped(result.myalert.PacketDroppedAlert)
                    setCheckedError(result.myalert.PacketErrorAlert)
                }
                setLoadingModal(true)
            })

    }


    const clickDropped = () => {
        setCheckedDropped(!checkedDropped)
    }

    const clickError = () => {
        setCheckedError(!checkedError)
    }

    const clickMemory = () => {
        setCheckedMemory(!checkedMemory)
    }

    const clickStatus = () => {
        setCheckedStatus(!checkedStatus)
    }

    const clickCPU = () => {
        setCheckedCPU(!checkedCPU)
    }

    const clickNetwork = () => {
        setCheckedNetwork(!checkedNetwork)
    }

    const handleSetAlert = (id, names) => {
        console.log(names)
        fetch('/AlertConfigure',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        idCluster: idCluster,
                        idContainer: id,
                        ContainerName: names,
                        MemPercAlert: MemoryPerc,
                        MemUsedAlert: MemoryUsed,
                        CacheAlert: CacheUsed,
                        CpuPercAlert: CpuPerc,
                        UserModeAlert: UserPerc,
                        KernelModeAlert: KernelPerc,
                        TxRxRateAlert: NetworkRate,
                        TxDataAlert: TxData,
                        RxDataAlert: RxData,
                        StatusChangeAlert: checkedStatus,
                        PacketDroppedAlert: checkedDropped,
                        PacketErrorAlert: checkedError,
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                console.log(result)
                // console.log('bbb')
                // console.log(result)
                // if (result.error) {
                //     M.toast({ html: data.error, classes: 'rounded red darken-3' })
                // }
                // else {
                //     M.toast({ html: "Alert added successfully", classes: 'rounded green' })
                //     // console.log(result)
                // }
            })
    }

    const renderRunning = () => {

        // console.log(data)
        if (data.length != 0) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        data.map(item => {
                            if (item.State == 'running') {
                                return (
                                    <>
                                        <div class="card horizontal" style={{ flex: '1 1 0px' }}>
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
                                                    <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '30px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div>
                                                            <button className="btn waves-effect waves-light" id='red-button' onClick={() => stopContainer(item.Id)}>
                                                                Stop Container
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button className="btn waves-effect waves-light" id='red-button' onClick={() => pauseContainer(item.Id)}>
                                                                Pause Container
                                                            </button>
                                                        </div>
                                                    </div>
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

                                            <Modal
                                                actions={[
                                                    <div id='modal-bottom'>
                                                        <Button flat modal="close" node="button" waves="green" id='red-button'>Close</Button>
                                                    </div>
                                                ]}
                                                bottomSheet={false}
                                                fixedFooter={false}
                                                header="Alert configuration"
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
                                                trigger={<h5>
                                                    <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: "absolute", top: '0', right: 0 }} onClick={() => execTrigger(item.Id)}>add_alert</i>
                                                </h5>}
                                            >
                                                {loadingModal ? (
                                                    <div>
                                                        <>
                                                            <div style={{ position: "absolute", top: '0', right: 0, cursor: 'default' }}>
                                                                <i class="material-icons" style={{ fontSize: '35px' }} >notifications</i>
                                                            </div>
                                                            <div>
                                                                <b id='blue-text'>{item.Names}</b>
                                                            </div>
                                                            <br></br>
                                                            <div style={{ display: 'flex', gap: '100px' }}>
                                                                <Checkbox
                                                                    checked={checkedMemory}
                                                                    label="Memory"
                                                                    onChange={clickMemory}
                                                                />
                                                                <Checkbox

                                                                    checked={checkedCPU}
                                                                    label="CPU"
                                                                    onChange={clickCPU}
                                                                />
                                                                <Checkbox

                                                                    checked={checkedNetwork}
                                                                    label="Network"
                                                                    onChange={clickNetwork}
                                                                />
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '150px' }}>
                                                                {
                                                                    checkedMemory ?
                                                                        (<div>
                                                                            <div className="input-field" style={{
                                                                                margin: "10px auto",
                                                                                maxWidth: "550px",
                                                                                padding: "20px",
                                                                                textAlign: "center",
                                                                            }}>
                                                                                <p><b id='white-text-large'>Memory</b></p>
                                                                                <div class="input-field">
                                                                                    <input id="green_input" type="text" value={MemoryPerc} onChange={(e) => setMemoryPerc(e.target.value)} />
                                                                                    <label for="mem_perc" class='active'>Memory Percentage Alert</label>
                                                                                </div>
                                                                                <br></br>
                                                                                <div class="input-field">
                                                                                    <input id="green_input" type="text" value={MemoryUsed} onChange={(e) => setMemoryUsed(e.target.value)} />
                                                                                    <label for="mem_used" class='active'>Memory Used Alert (MiB)</label>
                                                                                </div>
                                                                                <br></br>
                                                                                <div class="input-field">
                                                                                    <input id="green_input" type="text" value={CacheUsed} onChange={(e) => setCacheUsed(e.target.value)} />
                                                                                    <label for="cache_used" class='active'>Cache Alert(MiB)</label>
                                                                                </div>

                                                                            </div>
                                                                        </div>)

                                                                        : (<div></div>)
                                                                }
                                                                {
                                                                    checkedCPU ? (<div>
                                                                        <div className="input-field" style={{
                                                                            margin: "10px auto",
                                                                            maxWidth: "550px",
                                                                            padding: "20px",
                                                                            textAlign: "center",
                                                                        }}>
                                                                            <p><b id='white-text-large'>CPU</b></p>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={CpuPerc} onChange={(e) => setCpuPerc(e.target.value)} />
                                                                                <label for="cpu_perc" class='active'>CPU Percentage Alert</label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={UserPerc} onChange={(e) => setUserPerc(e.target.value)} />
                                                                                <label for="user_perc" class='active'>User mode Percentage</label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={KernelPerc} onChange={(e) => setKernelPerc(e.target.value)} />
                                                                                <label for="kernel_perc" class='active'>Kernel mode Percentage</label>
                                                                            </div>








                                                                        </div>
                                                                    </div>) : (<div></div>)
                                                                }
                                                                {
                                                                    checkedNetwork ? (<div>
                                                                        <div className="input-field" style={{
                                                                            margin: "10px auto",
                                                                            maxWidth: "550px",
                                                                            padding: "20px",
                                                                            textAlign: "center",
                                                                        }}>
                                                                            <p><b id='white-text-large'>Network</b></p>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={NetworkRate} onChange={(e) => setNetworkRate(e.target.value)} />
                                                                                <label for="rate_perc" class='active'>Tx/Rx Rate Alert</label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={TxData} onChange={(e) => setTxData(e.target.value)} />
                                                                                <label for="tx_data" class='active'>Tx Data Alert (MiB) </label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={RxData} onChange={(e) => setRxData(e.target.value)} />
                                                                                <label for="cache_used" class='active'>Rx Data Alert (MiB)</label>
                                                                            </div>

                                                                        </div>
                                                                    </div>) : (<div></div>)
                                                                }



                                                            </div>


                                                            <div style={{ display: 'flex', gap: '170px' }}>
                                                                <Checkbox
                                                                    checked={checkedStatus}
                                                                    label="Notify when status changes"
                                                                    onChange={clickStatus}
                                                                />
                                                                {
                                                                    checkedNetwork ? (
                                                                        <>
                                                                            <Checkbox

                                                                                checked={checkedDropped}
                                                                                label="Notify when Packets are dropped"
                                                                                onChange={clickDropped}
                                                                            />
                                                                            <Checkbox

                                                                                checked={checkedError}
                                                                                label="Notify when a Packet Error occurs"
                                                                                onChange={clickError}
                                                                            />


                                                                        </>) : (<div></div>)
                                                                }

                                                            </div>
                                                            <br></br>





                                                            {
                                                                checkedMemory || checkedCPU || checkedNetwork ? (<div style={{
                                                                    margin: "10px auto",
                                                                    maxWidth: "530px",
                                                                    textAlign: "center"
                                                                }}>
                                                                    <button class="btn waves-effect waves-light green" onClick={() => handleSetAlert(item.Id, item.Names[0].toString())}>Save
                                                                    </button>
                                                                </div>) : (<div></div>)
                                                            }

                                                        </>


                                                    </div>) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)}


                                            </Modal>


                                        </div>

                                    </>
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

    const renderPaused = () => {
        console.log('alex')
        if (data.length != 0) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        data.map(item => {

                            if (item.State == 'paused') {
                                return (
                                    <div class="card horizontal" style={{ flex: '1 1 0px' }}>
                                        <div class="card-image">
                                        </div>
                                        <div class="card-stacked">
                                            <div class="card-content">
                                                <p id='white-text'>
                                                    Type:<b style={{ color: 'rgb(255, 205, 86)' }}> Container</b>
                                                </p>
                                                <p id='white-text'>Name: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Names}</b></p>
                                                <p id='white-text'>State: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.State}</b></p>
                                                <p id='white-text'>Status: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Status}</b></p>
                                                <p id='white-text'>ID: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Id}</b></p>
                                                <p id='white-text'>Image: <b style={{ color: 'rgb(255, 205, 86)' }}>{item.Image}</b></p>
                                                <div style={{ marginTop: '20px' }}>
                                                    <button className="btn waves-effect waves-light" id='yellow-button' onClick={() => unpauseContainer(item.Id)}>
                                                        Unpause Container
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="card-action">
                                                <Link to="/containerdata" style={{ color: 'rgb(255, 205, 86)' }}
                                                    state={{
                                                        idContainer: item.Id,
                                                        domainName: domainName,
                                                        nickname: nickname
                                                    }}>View
                                                    details</Link>
                                            </div>

                                        </div>
                                        {/* <h5>
                                            <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer' }}>add_alert</i>
                                        </h5> */}
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        data.map(item => {
                            if (item.State == 'exited') {
                                return (
                                    <div class="card horizontal" style={{ flex: '1 1 0px' }}>
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
                                                <div style={{ marginTop: '20px' }}>
                                                    <button className="btn waves-effect waves-light" id='green-button' onClick={() => startContainer(item.Id)}>
                                                        Start Container
                                                    </button>
                                                </div>
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
                                        {/* <h5>
                                            <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer' }}>add_alert</i>
                                        </h5> */}
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            data.map(item => {
                                if (item.State == 'running') {
                                    return (
                                        <div class="card horizontal" style={{ flex: '1 1 0px' }}>
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
                                                    <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '30px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div>
                                                            <button className="btn waves-effect waves-light" id='red-button' onClick={() => stopContainer(item.Id)}>
                                                                Stop Container
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button className="btn waves-effect waves-light" id='red-button' onClick={() => pauseContainer(item.Id)}>
                                                                Pause Container
                                                            </button>
                                                        </div>
                                                    </div>

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
                                            <Modal
                                                actions={[
                                                    <div id='modal-bottom'>
                                                        <Button flat modal="close" node="button" waves="green" id='red-button'>Close</Button>
                                                    </div>
                                                ]}
                                                bottomSheet={false}
                                                fixedFooter={false}
                                                header="Alert configuration"
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
                                                trigger={<h5>
                                                    <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: "absolute", top: '0', right: 0 }} onClick={() => execTrigger(item.Id)}>add_alert</i>
                                                </h5>}
                                            >
                                                {loadingModal ? (
                                                    <div>
                                                        <>
                                                            <div style={{ position: "absolute", top: '0', right: 0, cursor: 'default' }}>
                                                                <i class="material-icons" style={{ fontSize: '35px' }} >notifications</i>
                                                            </div>
                                                            <div>
                                                                <b id='blue-text'>{item.Names}</b>
                                                            </div>
                                                            <br></br>
                                                            <div style={{ display: 'flex', gap: '100px' }}>
                                                                <Checkbox
                                                                    checked={checkedMemory}
                                                                    label="Memory"
                                                                    onChange={clickMemory}
                                                                />
                                                                <Checkbox

                                                                    checked={checkedCPU}
                                                                    label="CPU"
                                                                    onChange={clickCPU}
                                                                />
                                                                <Checkbox

                                                                    checked={checkedNetwork}
                                                                    label="Network"
                                                                    onChange={clickNetwork}
                                                                />
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '150px' }}>
                                                                {
                                                                    checkedMemory ?
                                                                        (<div>
                                                                            <div className="input-field" style={{
                                                                                margin: "10px auto",
                                                                                maxWidth: "550px",
                                                                                padding: "20px",
                                                                                textAlign: "center",
                                                                            }}>
                                                                                <p><b id='white-text-large'>Memory</b></p>
                                                                                <div class="input-field">
                                                                                    <input id="green_input" type="text" value={MemoryPerc} onChange={(e) => setMemoryPerc(e.target.value)} />
                                                                                    <label for="mem_perc" class='active'>Memory Percentage Alert</label>
                                                                                </div>
                                                                                <br></br>
                                                                                <div class="input-field">
                                                                                    <input id="green_input" type="text" value={MemoryUsed} onChange={(e) => setMemoryUsed(e.target.value)} />
                                                                                    <label for="mem_used" class='active'>Memory Used Alert (MiB)</label>
                                                                                </div>
                                                                                <br></br>
                                                                                <div class="input-field">
                                                                                    <input id="green_input" type="text" value={CacheUsed} onChange={(e) => setCacheUsed(e.target.value)} />
                                                                                    <label for="cache_used" class='active'>Cache Alert (MiB)</label>
                                                                                </div>

                                                                            </div>
                                                                        </div>)

                                                                        : (<div></div>)
                                                                }
                                                                {
                                                                    checkedCPU ? (<div>
                                                                        <div className="input-field" style={{
                                                                            margin: "10px auto",
                                                                            maxWidth: "550px",
                                                                            padding: "20px",
                                                                            textAlign: "center",
                                                                        }}>
                                                                            <p><b id='white-text-large'>CPU</b></p>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={CpuPerc} onChange={(e) => setCpuPerc(e.target.value)} />
                                                                                <label for="cpu_perc" class='active'>CPU Percentage Alert</label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={UserPerc} onChange={(e) => setUserPerc(e.target.value)} />
                                                                                <label for="user_perc" class='active'>User mode Percentage</label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={KernelPerc} onChange={(e) => setKernelPerc(e.target.value)} />
                                                                                <label for="kernel_perc" class='active'>Kernel mode Percentage</label>
                                                                            </div>








                                                                        </div>
                                                                    </div>) : (<div></div>)
                                                                }
                                                                {
                                                                    checkedNetwork ? (<div>
                                                                        <div className="input-field" style={{
                                                                            margin: "10px auto",
                                                                            maxWidth: "550px",
                                                                            padding: "20px",
                                                                            textAlign: "center",
                                                                        }}>
                                                                            <p><b id='white-text-large'>Network</b></p>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={NetworkRate} onChange={(e) => setNetworkRate(e.target.value)} />
                                                                                <label for="rate_perc" class='active'>Tx/Rx Rate Alert</label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={TxData} onChange={(e) => setTxData(e.target.value)} />
                                                                                <label for="tx_data" class='active'>Tx Data Alert (MiB) </label>
                                                                            </div>
                                                                            <br></br>
                                                                            <div class="input-field">
                                                                                <input id="green_input" type="text" value={RxData} onChange={(e) => setRxData(e.target.value)} />
                                                                                <label for="cache_used" class='active'>Rx Data Alert (MiB)</label>
                                                                            </div>

                                                                        </div>
                                                                    </div>) : (<div></div>)
                                                                }



                                                            </div>


                                                            <div style={{ display: 'flex', gap: '170px' }}>
                                                                <Checkbox
                                                                    checked={checkedStatus}
                                                                    label="Notify when status changes"
                                                                    onChange={clickStatus}
                                                                />
                                                                {
                                                                    checkedNetwork ? (
                                                                        <>
                                                                            <Checkbox

                                                                                checked={checkedDropped}
                                                                                label="Notify when Packets are dropped"
                                                                                onChange={clickDropped}
                                                                            />
                                                                            <Checkbox

                                                                                checked={checkedError}
                                                                                label="Notify when a Packet Error occurs"
                                                                                onChange={clickError}
                                                                            />


                                                                        </>) : (<div></div>)
                                                                }

                                                            </div>
                                                            <br></br>





                                                            {
                                                                checkedMemory || checkedCPU || checkedNetwork ? (<div style={{
                                                                    margin: "10px auto",
                                                                    maxWidth: "530px",
                                                                    textAlign: "center"
                                                                }}>
                                                                    <button class="btn waves-effect waves-light green" onClick={() => handleSetAlert(item.Id, item.Names[0].toString())}>Save
                                                                    </button>
                                                                </div>) : (<div></div>)
                                                            }

                                                        </>


                                                    </div>) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)}


                                            </Modal>
                                        </div>
                                    )
                                }
                                else {
                                    if (item.State == "paused") {
                                        return (

                                            <div class="card horizontal" style={{ flex: '1 1 0px' }}>
                                                <div class="card-image">
                                                </div>
                                                <div class="card-stacked">
                                                    <div class="card-content">
                                                        <p id='white-text'>
                                                            Type:<b style={{ color: 'rgb(255, 205, 86)' }}> Container</b>
                                                        </p>
                                                        <p id='white-text'>Name: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Names}</b></p>
                                                        <p id='white-text'>State: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.State}</b></p>
                                                        <p id='white-text'>Status: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Status}</b></p>
                                                        <p id='white-text'>ID: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Id}</b></p>
                                                        <p id='white-text'>Image: <b style={{ color: 'rgb(255, 205, 86)' }}>{item.Image}</b></p>
                                                        <div style={{ marginTop: '20px' }}>
                                                            <button className="btn waves-effect waves-light" id='yellow-button' onClick={() => unpauseContainer(item.Id)}>
                                                                Unpause Container
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="card-action">
                                                        <Link to="/containerdata" style={{ color: 'rgb(255, 205, 86)' }}
                                                            state={{
                                                                idContainer: item.Id,
                                                                domainName: domainName,
                                                                nickname: nickname
                                                            }}>View
                                                            details</Link>
                                                    </div>

                                                </div>
                                                {/* <h5>
                                            <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer' }}>add_alert</i>
                                        </h5> */}
                                            </div>
                                        )

                                    }
                                    else {
                                        return (


                                            <div class="card horizontal" style={{ flex: '1 1 0px' }} >
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
                                                        <div style={{ marginTop: '20px' }}>
                                                            <button className="btn waves-effect waves-light" id="green-button" onClick={() => startContainer(item.Id)}>
                                                                Start Container
                                                            </button>
                                                        </div>
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
                                                {/* <h5>
                                                <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer' }}>add_alert</i>
                                            </h5> */}
                                            </div>


                                        )

                                    }

                                }

                            })
                        }
                    </div >
                </div>
            )
        }

    }


    useInterval(() => {

        fetch('/GetServices',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        domainName: domainName,
                        nickname: nickname
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                console.log(result)
                setServices(result.containers)
            })

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
                let counter_paused = 0
                // setAux({})
                // var dict = {}
                if (result.containers != null) {
                    for (let i = 0; i < result.containers.length; i++) {
                        // fetch("/GetAlertsForContainer", {
                        //     method: "post",
                        //     headers:
                        //     {
                        //         "Authorization": "Bearer " + localStorage.getItem("jwt"),
                        //         "Content-Type": "application/json"
                        //     },
                        //     body: JSON.stringify(
                        //         {
                        //             idCluster: idCluster,
                        //             idContainer: result.containers[i].Id
                        //         }
                        //     )

                        // })
                        //     .then(res2 => res2.json())
                        //     .then(result2 => {
                        //         dict[result.containers[i].Id.toString()] = result2.containerNotifications.length
                        //         // console.log(dict)





                        //     })
                        // setAux(dict)



                        if (result.containers[i].State == 'running') {
                            counter_running++
                        }
                        if (result.containers[i].State == 'exited') {
                            counter_exited++
                        }
                        if (result.containers[i].State == 'paused') {
                            counter_paused++
                        }
                    }

                }

                setRunningCount(counter_running)
                setExitedCount(counter_exited)
                setPausedCount(counter_paused)
                // console.log(runningCount)
                // console.log(exitedCount)



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
                console.log(result.containers)
                setData(result.containers)
                let counter_running = 0
                let counter_exited = 0
                let counter_paused = 0
                if (result.containers != null) {
                    for (let i = 0; i < result.containers.length; i++) {
                        if (result.containers[i].State == 'running') {
                            counter_running++
                        }
                        if (result.containers[i].State == 'exited') {
                            counter_exited++
                        }
                        if (result.containers[i].State == 'paused') {
                            counter_paused++
                        }
                    }
                    setRunningCount(counter_running)
                    setExitedCount(counter_exited)
                    setPausedCount(counter_paused)
                    // console.log(runningCount)
                    // console.log(exitedCount)
                    setLoading(true)
                    setIsRunning(true)
                }
                else {
                    setIsRunning(false)
                }

            })
    }, [])

    return (
        <>
            {
                data == null ?
                    <div style={{ textAlign: 'center' }}><b id='white-text' style={{ fontSize: '50px' }}>Docker Remote API Connection ERROR !</b>
                        <br></br>
                        <b id='white-text' style={{ fontSize: '50px' }}>Start your Docker Remote API Server and refresh the page.</b>
                    </div>
                    : <div>
                        {
                            loading ? (<div style={{
                                background: "rgb(40,44,52)",
                                minHeight: '100vh',
                                overflow: 'auto'
                            }}>
                                <div class="col s12 m7" style={{
                                    margin: "10px auto",
                                    maxWidth: "900px",
                                    textAlign: "center"
                                }}>
                                    <b id='white-text' style={{ fontSize: '20px' }}>Cluster nickname: <b id='blue-text' style={{ fontSize: '20px' }}>{nickname}</b></b>
                                    <br></br>
                                    <b id='white-text' style={{ fontSize: '20px' }}>Id: <b id='blue-text' style={{ fontSize: '20px' }}>{idCluster}</b></b>

                                </div>


                                <div class="col s12 m7" style={{
                                    margin: "50px auto",
                                    maxWidth: "900px",
                                    textAlign: "center",

                                }}>

                                    <div style={{ display: 'flex', width: '70%', margin: '0 auto', gap: '10px' }}>
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
                                                    <div class="circle-yellow" onClick={() => seePaused()}>
                                                        <div style={{ marginTop: '40px' }}><b class="text-yellow">{pausedCount}</b></div>
                                                        <div><b class="text-yellow">paused</b></div>
                                                    </div>
                                                </>)
                                                : (
                                                    <>
                                                        {
                                                            selectedExit ? (
                                                                <>
                                                                    <div class="circle" onClick={() => seeRunning()}>
                                                                        <div style={{ marginTop: '40px' }}><b class="text">{runningCount}</b></div>
                                                                        <div><b class="text">running</b></div>
                                                                    </div>
                                                                    <div class="circle-red-selected" onClick={() => seeExited()}>
                                                                        <div style={{ marginTop: '40px' }}><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>{exitedCount}</b></div>
                                                                        <div><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>exited</b></div>
                                                                    </div>
                                                                    <div class="circle-yellow" onClick={() => seePaused()}>
                                                                        <div style={{ marginTop: '40px' }}><b class="text-yellow">{pausedCount}</b></div>
                                                                        <div><b class="text-yellow">paused</b></div>
                                                                    </div>
                                                                </>)

                                                                : (
                                                                    <>
                                                                        {
                                                                            selectedPause ?
                                                                                <>
                                                                                    <div class="circle" onClick={() => seeRunning()}>
                                                                                        <div style={{ marginTop: '40px' }}><b class="text">{runningCount}</b></div>
                                                                                        <div><b class="text">running</b></div>
                                                                                    </div>
                                                                                    <div class="circle-red" onClick={() => seeExited()}>
                                                                                        <div style={{ marginTop: '40px' }}><b class="text-red">{exitedCount}</b></div>
                                                                                        <div><b class="text-red">exited</b></div>
                                                                                    </div>
                                                                                    <div class="circle-yellow-selected" onClick={() => seePaused()}>
                                                                                        <div style={{ marginTop: '40px' }} ><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>{pausedCount}</b ></div>
                                                                                        <div><b style={{ color: 'white', margin: 'auto', fontSize: 'xx-large' }}>paused</b></div>
                                                                                    </div>
                                                                                </> :
                                                                                <>
                                                                                    <div class="circle" onClick={() => seeRunning()}>
                                                                                        <div style={{ marginTop: '40px' }}><b class="text">{runningCount}</b></div>
                                                                                        <div><b class="text">running</b></div>
                                                                                    </div>
                                                                                    <div class="circle-red" onClick={() => seeExited()}>
                                                                                        <div style={{ marginTop: '40px' }}><b class="text-red">{exitedCount}</b></div>
                                                                                        <div><b class="text-red">exited</b></div>
                                                                                    </div>
                                                                                    <div class="circle-yellow" onClick={() => seePaused()}>
                                                                                        <div style={{ marginTop: '40px' }}><b class="text-yellow">{pausedCount}</b></div>
                                                                                        <div><b class="text-yellow">paused</b></div>
                                                                                    </div>
                                                                                </>
                                                                        }
                                                                    </>



                                                                )
                                                        }


                                                    </>)

                                        }

                                    </div>
                                    <br></br>





                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                    <Link to="/generaldata" state={{
                                        idCluster: idCluster,
                                        domainName: domainName,
                                        nickname: nickname
                                    }}>

                                        <Button id='blue-button'>View General Data</Button>

                                    </Link>
                                </div>
                                <div style={{ marginLeft: '190px', marginRight: '190px' }}>


                                    {
                                        showServices ? <>

                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                                <Button id='blue-button' onClick={() => { setShowServices(false) }}>View Less</Button>
                                            </div>
                                            <>
                                                {
                                                    Services.length == 0 ? <b id='white-text' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', marginBottom: '30px' }}> no Services</b> : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                                                        {
                                                            Services.map(item => {
                                                                return (
                                                                    <>
                                                                        <div class="card horizontal" style={{ flex: '1 1 0px' }}>
                                                                            <div class="card-image">
                                                                            </div>
                                                                            <div class="card-stacked">
                                                                                <div class="card-content">
                                                                                    <p id='white-text'>
                                                                                        Type:<b style={{ color: 'rgb(32,151,207)' }}> Service</b>
                                                                                    </p>
                                                                                    <p id='white-text'>Created At: <b style={{ color: 'rgb(32,151,207)' }}>{new Date(item.CreatedAt).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></p>
                                                                                    <p id='white-text'>Updated At: <b style={{ color: 'rgb(32,151,207)' }}>{new Date(item.UpdatedAt).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></p>
                                                                                    <p id='white-text'>Name: <b id='green-text'> {item.Spec["Name"]}</b></p>
                                                                                    <p id='white-text'>Replicas: <b id='green-text'> {item.Spec["Mode"]["Replicated"]["Replicas"]}</b></p>
                                                                                    {/* <p id='white-text'>ID: <b style={{ color: 'rgb(32,151,207)' }}> {item.Id}</b></p> */}
                                                                                    <p id='white-text'>Image: <b style={{ color: 'rgb(32,151,207)' }}>{item.Spec["TaskTemplate"]["ContainerSpec"]["Image"].split("@")[0]}</b></p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>

                                                                )
                                                            })
                                                        }
                                                    </div>
                                                }
                                            </>

                                        </> : <><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                            <Button id='blue-button' onClick={() => renderServices()}>View Services</Button>
                                        </div></>
                                    }

                                    {
                                        selectedRunning ?
                                            (
                                                <div>
                                                    {renderRunning()}
                                                </div>
                                            ) :
                                            (<div>
                                                {selectedExit ?
                                                    (
                                                        <div>
                                                            {renderExited()}
                                                        </div>
                                                    ) :
                                                    (
                                                        <div>
                                                            {
                                                                selectedPause ? <div>{renderPaused()}</div> :
                                                                    <div>
                                                                        {renderAll()}
                                                                    </div>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>)
                                    }

                                </div>
                            </div >) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)

                        }
                    </div>
            }
        </>



    )

}

export default ClusterInfo