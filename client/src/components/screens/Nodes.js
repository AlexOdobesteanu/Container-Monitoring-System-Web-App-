import React, { useEffect, useState, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { useLocation } from 'react-router-dom';
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import { Link, useNavigate } from 'react-router-dom';
import { CircleLoader, DotLoader, HashLoader, MoonLoader, RingLoader } from 'react-spinners';
import { Collapsible, CollapsibleItem, Icon, TextInput, Button, Modal, Checkbox } from 'react-materialize'
import wrench from "../../logos/wrench.png"
import manager from "../../logos/manager.png"
import axios from 'axios'
import fileDownload from 'js-file-download'
import { Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography';
import M from 'materialize-css'
import "../../App.css"
const yaml = require('js-yaml');
const fs = require('fs')

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

const Nodes = () => {
    const location = useLocation();
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const idCluster = location.state.idCluster
    const [checkNodeID, setCheckNodeId] = useState("")
    const [NodesData, setNodesData] = useState([])
    const [allContainers, setAllContainers] = useState([])
    const domainName = location.state.domainName
    const nickname = location.state.nickname
    const [seeContainers, setSeeContainers] = useState(false)
    const [isRunning, setIsRunning] = useState(true);
    const [delay, setDelay] = useState(2000);
    const [Services, setServices] = useState([])
    const [showServices, setShowServices] = useState(false)
    const [loading, setLoading] = useState(false)


    const [allNodes, setAllNodes] = useState([])


    const [certsPass, setPass] = useState("")
    const [certDays, setCertDays] = useState("")
    const [caDays, setCaDays] = useState("")
    const [certHostname, setCertHostname] = useState("")
    const [nicknameAux, setNicknameAux] = useState("")
    const [showDownload, setShowDownload] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [multipleFiles, setMultipleFiles] = useState([])

    const execTrigger = (id) => {
        setPass("")
        setCertDays("")
        setCaDays("")
        setCertHostname("")
        setNicknameAux("")
        setShowDownload(false)
        setShowUpload(false)
        console.log(id)
    }

    const execTrigger2 = (id, nick) => {
        setPass("")
        setCertDays("")
        setCaDays("")
        setCertHostname("")
        setNicknameAux("")
        setShowDownload(false)
        setShowUpload(true)
        setNicknameAux(nick)
        console.log(id)
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

    const nodeInfo = (idNode) => {
        let found = false
        for (let i = 0; i < allNodes.length; i++) {
            if (allNodes[i].NodeID == idNode) {
                found = true
                return (
                    <div>
                        <br></br>
                        <p id='green-text'>
                            <b> CONFIGURED</b>
                        </p>
                        <p id='white-text'>
                            Domain Name:<b style={{ color: 'rgb(32,151,207)' }}> {allNodes[i].domainName}</b>
                        </p>
                        <br></br>

                        <Modal
                            actions={[
                                <div id='modal-bottom'>
                                    <Button flat modal="close" node="button" waves="green" id='red-button'>Close</Button>
                                </div>
                            ]}
                            bottomSheet={false}
                            fixedFooter={true}
                            header="Edit Node"
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
                                <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: "absolute", top: '0', right: 0 }} onClick={() => execTrigger2(idNode, allNodes[i].nickname)}>edit</i>
                            </h5>}
                        >

                            <div>
                                <div style={{
                                    margin: "10px auto",
                                    maxWidth: "550px",
                                    padding: "20px",
                                    textAlign: "center"
                                }}>
                                    <div style={{ marginBottom: '30px' }}>
                                        <b id='white-text' style={{ fontStyle: 'italic', fontSize: '30px' }}>Edit your Docker Remote API Instance</b>
                                        <br></br>
                                        <b id='white-text' style={{ fontStyle: 'italic', fontSize: '15px' }}>Nickname : {nicknameAux}</b>
                                        <br></br>
                                    </div>
                                    <div className="card input-field" style={{
                                        margin: "10px auto",
                                        maxWidth: "550px",
                                        padding: "20px",
                                        textAlign: "center"
                                    }}>
                                        <input type="text" placeholder="Domain name of the docker server"
                                            value={certHostname} onChange={(e) => setCertHostname(e.target.value)}>

                                        </input>

                                        <input type="password" placeholder='Passphrase to encrypt the certificate'
                                            value={certsPass} onChange={(e) => setPass(e.target.value)}>

                                        </input>

                                        <input type="text" pattern='[0-9]*' placeholder='Server & client certificate expiration in days (default 365 days)'
                                            value={certDays} onChange={(e) => setCertDays((v) => (e.target.validity.valid ? e.target.value : v))}>

                                        </input>

                                        <input type="text" pattern='[0-9]*' placeholder='Certificate expiration for CA in days (default 900 days)'
                                            value={caDays} onChange={(e) => setCaDays((v) => (e.target.validity.valid ? e.target.value : v))}>

                                        </input>

                                        <button class="btn waves-effect waves-light green" type="submit" name="action" onClick={() => sendInput_edit(allNodes[i].NodeID)}>Edit
                                            <i class="material-icons right">send</i>
                                        </button>



                                    </div>

                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    {showDownload ? (
                                        <div>
                                            <div class="card-panel ">
                                                <span class="white-text">
                                                    <p>docker-compose.yml</p>
                                                    Download the config file and run it
                                                    on your system.
                                                </span>
                                            </div>
                                            <br></br>

                                            <button class="btn waves-effect waves-light green" onClick={(e) => download(e)}>
                                                <i class="material-icons center">file_download</i>
                                            </button>
                                        </div>) : (<div></div>)}

                                    <br></br>
                                    <br></br>
                                    <br></br>

                                    {showUpload ? (<div>
                                        <form action="#" method="POST" onSubmit={uploadMultipleFiles}>
                                            <div class='file-field input-field'>
                                                <div class='btn green'>
                                                    <span>File</span>
                                                    <input type="file" onChange={multipleFileChange} accept='.pem' multiple />
                                                </div>
                                                <div class='file-path-wrapper'>
                                                    <input class="file-path validate" type="text" placeholder="Upload key.pem, cert.pem, ca.pem" />
                                                </div>
                                            </div>
                                            {/* <input type="submit" className='waves-effect waves-light btn green' value="Upload your files" /> */}
                                            <button class="btn waves-effect waves-light green" type="submit" name="action">
                                                <i class="material-icons center">file_upload</i>
                                            </button>
                                        </form>
                                    </div>) : (<div></div>)}


                                </div >

                            </div>
                        </Modal>




                        <Link to="/clusterinfo" state={{
                            idCluster: idCluster,
                            domainName: allNodes[i].domainName.toString(),
                            nickname: allNodes[i].nickname.toString(),
                            idNode: allNodes[i]._id.toString(),
                            ClusterName: nickname
                        }}>
                            <button class="btn waves-effect waves-light green" id='blue-button'>View Full Details</button>
                        </Link>

                    </div>
                )
            }
        }
        if (found == false && idNode != checkNodeID) {
            return (
                <div>
                    <b style={{ color: 'red', fontWeight: 'bold' }}>NOT CONFIGURED</b>
                    <Modal
                        actions={[
                            <div id='modal-bottom'>
                                <Button flat modal="close" node="button" waves="green" id='red-button'>Close</Button>
                            </div>
                        ]}
                        bottomSheet={false}
                        fixedFooter={true}
                        header="Add node"
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
                            <i className="medium material-icons white-text " style={{ fontSize: '30px', cursor: 'pointer', position: "absolute", top: '0', right: 0 }} onClick={() => execTrigger(idNode)}>add</i>
                        </h5>}
                    >
                        <div style={{
                            margin: "10px auto",
                            maxWidth: "550px",
                            padding: "20px",
                            textAlign: "center"
                        }}>
                            <b id='white-text' style={{ fontStyle: 'italic', fontSize: '30px' }}>Configure your Docker Remote API Server</b>
                            <br></br>
                            <div className="card input-field" style={{
                                margin: "10px auto",
                                maxWidth: "550px",
                                padding: "20px",
                                textAlign: "center"
                            }}>
                                <input type="text" placeholder="Domain name of the docker server"
                                    value={certHostname} onChange={(e) => setCertHostname(e.target.value)}>

                                </input>

                                <input type="password" placeholder='Passphrase to encrypt the certificate'
                                    value={certsPass} onChange={(e) => setPass(e.target.value)}>

                                </input>

                                <input type="text" pattern='[0-9]*' placeholder='Server & client certificate expiration in days (default 365 days)'
                                    value={certDays} onChange={(e) => setCertDays((v) => (e.target.validity.valid ? e.target.value : v))}>

                                </input>

                                <input type="text" pattern='[0-9]*' placeholder='Certificate expiration for CA in days (default 900 days)'
                                    value={caDays} onChange={(e) => setCaDays((v) => (e.target.validity.valid ? e.target.value : v))}>

                                </input>

                                <input type="text" placeholder="Choose nickname for this instance"
                                    value={nicknameAux} onChange={(e) => setNicknameAux(e.target.value)}>

                                </input>

                                <button class="btn waves-effect waves-light green" type="submit" name="action" onClick={() => sendInput(idNode)}>Send info
                                    <i class="material-icons right">send</i>
                                </button>
                            </div>

                            <br></br>
                            <br></br>
                            <br></br>
                            {showDownload ? (
                                <div>
                                    <div class="card-panel ">
                                        <span class="white-text">
                                            <p>docker-compose.yml</p>
                                            Download the config file and run it
                                            on your system.
                                        </span>
                                    </div>
                                    <br></br>

                                    <button class="btn waves-effect waves-light green" onClick={(e) => download(e)}>
                                        <i class="material-icons center">file_download</i>
                                    </button>
                                </div>) : (<div></div>)}

                            <br></br>
                            <br></br>
                            <br></br>

                            {showUpload ? (<div>
                                <form action="#" method="POST" onSubmit={uploadMultipleFiles}>
                                    <div class='file-field input-field'>
                                        <div class='btn green'>
                                            <span>File</span>
                                            <input type="file" onChange={multipleFileChange} accept='.pem' multiple />
                                        </div>
                                        <div class='file-path-wrapper'>
                                            <input class="file-path validate" type="text" placeholder="Upload key.pem, cert.pem, ca.pem" />
                                        </div>
                                    </div>
                                    {/* <input type="submit" className='waves-effect waves-light btn green' value="Upload your files" /> */}
                                    <button class="btn waves-effect waves-light green" type="submit" name="action">
                                        <i class="material-icons center">file_upload</i>
                                    </button>
                                </form>
                            </div>) : (<div></div>)}


                        </div >



                    </Modal>
                </div>
            )
        }

    }

    const multipleFileChange = (e) => {
        setMultipleFiles(e.target.files)
    }

    const uploadMultipleFiles = (e) => {
        e.preventDefault()
        const data = new FormData()
        for (let i = 0; i < multipleFiles.length; i++) {
            data.append('files', multipleFiles[i])
        }

        const headers = {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }

        const params = {
            nickname: nicknameAux
        }

        axios.post("/multiple", data,
            {
                headers: headers,
                params: params
            })
            .then(result => {
                console.log(result)
                if (result.data['succes']) {
                    M.toast({ html: 'Uploaded successfully', classes: 'rounded green' })
                }
            })
            .catch(err => M.toast({ html: 'Incorrect files chosen', classes: 'rounded red darken-3' }))
    }

    const download = (e) => {
        e.preventDefault()
        axios({
            url: "/download",
            method: "GET",
            responseType: "blob",
            params: {
                nickname: nicknameAux
            },
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            }
        }).then((res) => {
            console.log(res)
            fileDownload(res.data, "docker-compose.yml")
            setShowUpload(true)
        })


    }

    const sendInput_edit = (idNode) => {
        if (!certsPass || !certHostname || !nickname) {
            M.toast({ html: "Empty fields", classes: "rounded red darken-3" })
            return
        }
        // if (caDays == null || certDays == null) {
        //     setCaDays("900")
        //     setCertDays("365")
        // }
        fetch("/EditNode", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster,
                domainName: certHostname,
                nickname: nicknameAux,
                caDays: caDays,
                certDays: certDays,
                certsPass: certsPass,
                NodeID: idNode.toString()

            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                if (result.succes) {
                    M.toast({ html: 'Generated yml successfully', classes: 'rounded green' })
                    setShowDownload(true)
                }
            })
    }

    const sendInput = (idNode) => {
        if (!certsPass || !certHostname || !nicknameAux) {
            M.toast({ html: "Empty fields", classes: "rounded red darken-3" })
            return
        }
        // if (caDays == null || certDays == null) {
        //     setCaDays("900")
        //     setCertDays("365")
        // }
        fetch("/dockersupp", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hostname: certHostname,
                caDays: caDays,
                certDays: certDays,
                certsPass: certsPass,
                nickname: nicknameAux
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.error) {
                    M.toast({ html: result.error, classes: 'rounded red darken-3' })
                }
                if (result.succes) {
                    M.toast({ html: 'Generated yml successfully', classes: 'rounded green' })
                    fetch("/nodeadd", {
                        method: "post",
                        headers:
                        {
                            "Authorization": "Bearer " + localStorage.getItem("jwt"),
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            domainName: certHostname,
                            nickname: nicknameAux,
                            idCluster: idCluster,
                            NodeID: idNode
                        })
                    }).then(res => res.json())
                        .then(data => {
                            if (data.error) {
                                M.toast({ html: data.error, classes: 'rounded red darken-3' })
                            }
                            else {
                                M.toast({ html: "Added info successfully", classes: 'rounded green' })
                            }
                        }).catch(err => {
                            console.log(err)
                        })

                    setShowDownload(true)
                }
            })
    }


    useInterval(() => {
        fetch("/getnodeinfo", {
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
                setAllNodes(result.nodes)
                if (result.allContainers != null) {
                    setAllContainers(result.allContainers[0])

                }
                else {
                    setAllContainers([])
                }

                // console.log(result.allContainers[0])
                if (result.nodes.length == 0) {

                    return (
                        setAllContainers([])
                    )
                }
                else {
                    // console.log(result.nodes)
                    setAllNodes(result.nodes)
                }
            })
        fetch("/GetInfo", {
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
                console.log(result.info.Swarm.NodeID)
                if (result.info.Swarm.NodeID == null) {
                    return (
                        setCheckNodeId(null)
                    )
                }
                else {
                    setCheckNodeId(result.info.Swarm.NodeID)
                }
            })

        fetch("/GetNodes", {
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
                if (result.nodes.length == 0) {
                    console.log("aaa")
                    setNodesData([])
                    setLoading(true)

                }
                else {
                    console.log(result.nodes)
                    setNodesData(result.nodes)
                    setLoading(true)

                }

            })


    }, isRunning ? delay : null);

    useEffect(() => {
        fetch("/getnodeinfo", {
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
                console.log(result.nodes)
                setAllNodes(result.nodes)
                if (result.allContainers != null) {
                    setAllContainers(result.allContainers[0])

                }

                // console.log(result.allContainers[0])
                if (result.nodes.length == 0) {

                    setAllContainers([])
                }
                else {
                    // console.log(result.nodes)
                    setAllNodes(result.nodes)
                }
            })
        fetch("/GetInfo", {
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
                console.log(result.info.Swarm.NodeID)
                if (result.info.Swarm.NodeID == null) {
                    return (
                        <div id='white-text'>aaa</div>
                    )
                }
                else {
                    setCheckNodeId(result.info.Swarm.NodeID)
                }
            })

        fetch("/GetNodes", {
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
                if (result.nodes.length == 0) {
                    console.log("aaa")
                    setLoading(false)
                    return (
                        <div id='white-text'>aaa</div>
                    )
                }
                else {
                    console.log(result.nodes)
                    setNodesData(result.nodes)
                    setLoading(true)


                }

            })


    }, [])
    return (
        <div>
            {
                loading ? (<div style={{
                    background: "rgb(40,44,52)",
                    minHeight: '100vh',
                    overflow: 'auto'
                }}>
                    <div>
                        {
                            seeContainers ?
                                <>
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                            <Button id='blue-button' onClick={() => { setSeeContainers(false) }}>Hide Containers</Button>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: '190px', marginRight: '190px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                            {
                                                allContainers.map(containerArray => {
                                                    return (
                                                        containerArray.map(item => {
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


                                                                            </div>
                                                                        </div>
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
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>

                                </>
                                :
                                <>
                                    {
                                        allNodes.length == 0 ? <></> : <><div style={{ marginTop: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                                <Button id='blue-button' onClick={() => { setSeeContainers(true) }}>View Cluster Containers</Button>
                                            </div>

                                        </div></>
                                    }
                                </>
                        }
                    </div>



                    <div class="col s12 m7" style={{
                        margin: "10px auto",
                        maxWidth: "900px",
                        textAlign: "center"
                    }}>



                        <b id='white-text' style={{ fontSize: '20px' }}>Cluster nickname: <b id='blue-text' style={{ fontSize: '20px' }}>{nickname}</b></b>
                        <br></br>
                        <b id='white-text' style={{ fontSize: '20px' }}>Id: <b id='blue-text' style={{ fontSize: '20px' }}>{idCluster}</b></b>

                        <div>
                            <div>
                                {
                                    allNodes.length == 0 ? <div>
                                        <br></br>
                                        <br></br>

                                        <b id='white-text'>Your node is not part of a docker swarm/The swarm has only one node.</b>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <Link to="/clusterinfo" state={{
                                            idCluster: idCluster,
                                            domainName: domainName,
                                            nickname: nickname,
                                            ClusterName: nickname,
                                            idNode: "",
                                        }}>
                                            <button class="btn waves-effect waves-light green" id='blue-button'>View Full Details Of Your Node</button>
                                        </Link>
                                    </div> : showServices ? <>

                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                            <Button id='blue-button' onClick={() => { setShowServices(false) }}>View Less</Button>
                                        </div>
                                        <>
                                            {
                                                Services.length == 0 ? <b id='white-text' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', marginBottom: '30px', flex: '1 1 0px' }}> no Services</b> : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                                                    {
                                                        Services.map(item => {
                                                            return (
                                                                <>
                                                                    <div class="card horizontal">
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

                                                                            <Modal
                                                                                actions={[
                                                                                    <div id='modal-bottom'>
                                                                                        <Button flat modal="close" node="button" waves="green" id='red-button'>Close</Button>
                                                                                    </div>
                                                                                ]}
                                                                                bottomSheet={false}
                                                                                fixedFooter={true}
                                                                                header="Service details"
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
                                                                                <p id='white-text'>
                                                                                    Type:<b style={{ color: 'rgb(32,151,207)' }}> Service</b>
                                                                                </p>
                                                                                <p id='white-text'>Image: <b style={{ color: 'rgb(32,151,207)' }}>{item.Spec["TaskTemplate"]["ContainerSpec"]["Image"].split("@")[0]}</b></p>
                                                                                <p id='white-text'>Created At: <b style={{ color: 'rgb(32,151,207)' }}>{new Date(item.CreatedAt).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></p>
                                                                                <p id='white-text'>Updated At: <b style={{ color: 'rgb(32,151,207)' }}>{new Date(item.UpdatedAt).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b></p>
                                                                                <br></br>
                                                                                <p id='white-text'>Name: <b id='green-text'> {item.Spec["Name"]}</b></p>
                                                                                <p id='white-text'>Replicas: <b id='green-text'> {item.Spec["Mode"]["Replicated"]["Replicas"]}</b></p>
                                                                                <p id='white-text'>Max Replicas per Node: <b id='green-text'> {item.Spec["TaskTemplate"]["Placement"]["MaxReplicas"]}</b></p>
                                                                                <br></br>
                                                                                <p id='white-text' style={{ textDecoration: 'underline' }}>Platforms</p>
                                                                                <div>
                                                                                    {
                                                                                        item.Spec["TaskTemplate"]["Placement"]["Platforms"].map(item2 => {
                                                                                            return (
                                                                                                <div>
                                                                                                    {
                                                                                                        item2["Architecture"] == null ? <p id='white-text'>OS: <b id='green-text'> {item2["OS"]}</b></p> : <><p id='white-text'>Architecture: <b id='green-text'> {item2["Architecture"]}</b></p>
                                                                                                            <p id='white-text'>OS: <b id='green-text'> {item2["OS"]}</b></p></>
                                                                                                    }
                                                                                                    <br></br>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                                <p id='white-text' style={{ textDecoration: 'underline' }}>Virtual IPs</p>
                                                                                <div>
                                                                                    {
                                                                                        item.Endpoint["VirtualIPs"].map(item => {
                                                                                            return (
                                                                                                <div>
                                                                                                    <p id='white-text'>NetworkID: <b id='green-text'> {item["NetworkID"]}</b></p>
                                                                                                    <p id='white-text'>Address: <b id='green-text'> {item["Addr"]}</b></p>
                                                                                                    <br></br>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>





                                                                            </Modal>
                                                                        </div>

                                                                    </div>
                                                                </>

                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </>

                                    </> :
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                                                <Button id='blue-button' onClick={() => renderServices()}>View Services</Button>
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', flex: '1 1 0px' }}>
                            {
                                NodesData.map(item => {
                                    return (<div class="card horizontal">
                                        <div>
                                            {
                                                item.Spec.Role == "manager" ? <><p id='white-text'>
                                                    <img src={manager} style={{ width: '35px', top: "0px", right: '0px' }} className='imgInverted' ></img>
                                                </p></> : <></>
                                            }
                                        </div>
                                        <div>
                                            {
                                                item.Spec.Role == "worker" ? <><p id='white-text'>
                                                    <img src={wrench} style={{ width: '35px', top: "0px", right: '0px' }} className='imgInverted' ></img>
                                                </p></> : <></>
                                            }
                                        </div>
                                        <div class="card-image">
                                        </div>
                                        <div class="card-stacked">
                                            <div class="card-content">

                                                <p id='white-text'>
                                                    <b style={{ fontSize: '30px' }}> {item.Spec.Role}</b>
                                                </p>



                                                <p id='white-text'>
                                                    Status:<b style={{ color: 'rgb(32,151,207)' }}> {item.Status.State}</b>
                                                </p>
                                                <p id='white-text'>
                                                    Address:<b style={{ color: 'rgb(32,151,207)' }}> {item.Status.Addr}</b>
                                                </p>
                                                <br></br>
                                                <p id='white-text'>
                                                    Node ID:<b style={{ color: 'rgb(32,151,207)' }}> {item.ID}</b>
                                                </p>
                                                <p id='white-text'>
                                                    Hostname:<b style={{ color: 'rgb(32,151,207)' }}> {item.Description.Hostname}</b>
                                                </p>
                                                <br></br>
                                                <p id='white-text'>
                                                    Created At:<b style={{ color: 'rgb(32,151,207)' }}> {new Date(item.CreatedAt).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b>
                                                </p>
                                                <p id='white-text'>
                                                    Updated At:<b style={{ color: 'rgb(32,151,207)' }}> {new Date(item.UpdatedAt).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b>
                                                </p>
                                                <br></br>
                                                <p id='white-text'>
                                                    Platform:<b style={{ color: 'rgb(32,151,207)' }}> {item.Description.Platform.Architecture}</b>
                                                </p>
                                                <p id='white-text'>
                                                    OS:<b style={{ color: 'rgb(32,151,207)' }}> {item.Description.Platform.OS}</b>
                                                </p>
                                                <p id='white-text'>
                                                    Memory (MIB):<b style={{ color: 'rgb(32,151,207)' }}> {(parseFloat(item.Description.Resources.MemoryBytes) / 1000000).toFixed(3)}</b>
                                                </p>


                                                <div>{nodeInfo(item.ID)}</div>

                                                {/* <div>
                                                    {
                                                        item.Spec.Role != "manager" ? <></> :
                                                            <>


                                                            </>
                                                    }

                                                </div> */}



                                                <div>
                                                    {

                                                        item.ID == checkNodeID ?
                                                            <>
                                                                <br></br>
                                                                <p id='green-text'>
                                                                    <b> CONFIGURED</b>
                                                                </p>
                                                                <p id='white-text'>
                                                                    Domain Name:<b style={{ color: 'rgb(32,151,207)' }}> {domainName}</b>
                                                                </p>
                                                                <br></br>
                                                                <br></br>
                                                                <Link to="/clusterinfo" state={{
                                                                    idCluster: idCluster,
                                                                    domainName: domainName,
                                                                    nickname: nickname,
                                                                    idNode: item._id,
                                                                }}>
                                                                    <button class="btn waves-effect waves-light green" id='blue-button'>View Full Details</button>
                                                                </Link>


                                                            </>
                                                            :
                                                            <>



                                                            </>
                                                    }

                                                </div>

                                            </div>
                                        </div>
                                    </div>)


                                })
                            }



                        </div>
                    </div>
                </div>) : <div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>
            }

        </div>
    )

}

export default Nodes