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
    const execTrigger = () => {
        setCheckedMemory(false)
        setCheckedCPU(false)
        setCheckedNetwork(false)
        setCheckedStatus(false)
        setCheckedDropped(false)
        setCheckedError(false)
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

    const handleSetAlert = (id) => {
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
                        PacketErrorAlert: checkedError
                    }
                )
            }
        ).then(res => res.json())
            .then(result => {
                if (result.error) {
                    M.toast({ html: data.error, classes: 'rounded red darken-3' })
                }
                else {
                    M.toast({ html: "Alert added successfully", classes: 'rounded green' })
                }
            })
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
                                    <>
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

                                            <Modal
                                                actions={[
                                                    <Button flat modal="close" node="button" waves="green">Close</Button>
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
                                                    preventScrolling: true,
                                                    startingTop: '4%'
                                                }}
                                                trigger={<h5>
                                                    <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: "absolute", top: '0', right: 0 }} onClick={() => execTrigger()}>add_alert</i>
                                                </h5>}
                                            >
                                                <>
                                                    <div style={{ position: "absolute", top: '0', right: 0, cursor: 'default' }}>
                                                        <i class="material-icons" style={{ fontSize: '35px' }} >notifications</i>
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
                                                                            <input id="last_name" type="text" />
                                                                            <label for="mem_perc">Memory Percentage Alert</label>
                                                                        </div>
                                                                        <br></br>
                                                                        <div class="input-field">
                                                                            <input id="last_name" type="text" />
                                                                            <label for="mem_used">Memory Used Alert</label>
                                                                        </div>
                                                                        <br></br>
                                                                        <div class="input-field">
                                                                            <input id="last_name" type="text" />
                                                                            <label for="cache_used">Cache Alert</label>
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
                                                                        <input id="last_name" type="text" />
                                                                        <label for="cpu_perc">CPU Percentage Alert</label>
                                                                    </div>
                                                                    <br></br>
                                                                    <div class="input-field">
                                                                        <input id="last_name" type="text" />
                                                                        <label for="user_perc">User mode Percentage</label>
                                                                    </div>
                                                                    <br></br>
                                                                    <div class="input-field">
                                                                        <input id="last_name" type="text" />
                                                                        <label for="kernel_perc">Kernel mode Percentage</label>
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
                                                                        <input id="last_name" type="text" />
                                                                        <label for="mem_perc">Memory Percentage Alert</label>
                                                                    </div>
                                                                    <br></br>
                                                                    <div class="input-field">
                                                                        <input id="last_name" type="text" />
                                                                        <label for="mem_used">Memory Used Alert</label>
                                                                    </div>
                                                                    <br></br>
                                                                    <div class="input-field">
                                                                        <input id="last_name" type="text" />
                                                                        <label for="cache_used">Cache Alert</label>
                                                                    </div>







                                                                </div>
                                                            </div>) : (<div></div>)
                                                        }



                                                    </div>
                                                    {
                                                        checkedMemory || checkedCPU || checkedNetwork ? (<div style={{
                                                            margin: "10px auto",
                                                            maxWidth: "530px",
                                                            textAlign: "center"
                                                        }}>
                                                            <button class="btn waves-effect waves-light green" onClick={() => handleSetAlert(item.Id)}>Set Alerts
                                                            </button>
                                                        </div>) : (<div></div>)
                                                    }
                                                </>
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
                                                <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: "absolute", top: '0', right: 0 }} onClick={() => execTrigger()}>add_alert</i>
                                            </h5>}
                                        >
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
                                                                        <input id="last_name" type="text" value={MemoryPerc} onChange={(e) => setMemoryPerc(e.target.value)} />
                                                                        <label for="mem_perc">Memory Percentage Alert</label>
                                                                    </div>
                                                                    <br></br>
                                                                    <div class="input-field">
                                                                        <input id="last_name" type="text" value={MemoryUsed} onChange={(e) => setMemoryUsed(e.target.value)} />
                                                                        <label for="mem_used">Memory Used Alert</label>
                                                                    </div>
                                                                    <br></br>
                                                                    <div class="input-field">
                                                                        <input id="last_name" type="text" value={CacheUsed} onChange={(e) => setCacheUsed(e.target.value)} />
                                                                        <label for="cache_used">Cache Alert</label>
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
                                                                    <input id="last_name" type="text" value={CpuPerc} onChange={(e) => setCpuPerc(e.target.value)} />
                                                                    <label for="cpu_perc">CPU Percentage Alert</label>
                                                                </div>
                                                                <br></br>
                                                                <div class="input-field">
                                                                    <input id="last_name" type="text" value={UserPerc} onChange={(e) => setUserPerc(e.target.value)} />
                                                                    <label for="user_perc">User mode Percentage</label>
                                                                </div>
                                                                <br></br>
                                                                <div class="input-field">
                                                                    <input id="last_name" type="text" value={KernelPerc} onChange={(e) => setKernelPerc(e.target.value)} />
                                                                    <label for="kernel_perc">Kernel mode Percentage</label>
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
                                                                    <input id="last_name" type="text" value={NetworkRate} onChange={(e) => setNetworkRate(e.target.value)} />
                                                                    <label for="rate_perc">Tx/Rx Rate Alert</label>
                                                                </div>
                                                                <br></br>
                                                                <div class="input-field">
                                                                    <input id="last_name" type="text" value={TxData} onChange={(e) => setTxData(e.target.value)} />
                                                                    <label for="tx_data">Tx Data Alert (MiB) </label>
                                                                </div>
                                                                <br></br>
                                                                <div class="input-field">
                                                                    <input id="last_name" type="text" value={RxData} onChange={(e) => setRxData(e.target.value)} />
                                                                    <label for="cache_used">Rx Data Alert (MiB)</label>
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
                                                        <button class="btn waves-effect waves-light green" onClick={() => handleSetAlert(item.Id)}>Set Alerts
                                                        </button>
                                                    </div>) : (<div></div>)
                                                }

                                            </>

                                        </Modal>
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
                                        {/* <h5>
                                            <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer' }}>add_alert</i>
                                        </h5> */}
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
                    minHeight: '100vh',
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