import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { useLocation, useNavigate } from 'react-router-dom';
import { } from "materialize-css"
import fileDownload from 'js-file-download'
import { Parallax, Background } from 'react-parallax';
import axios from 'axios'
import M from 'materialize-css'

const EditInstance = () => {
    const location = useLocation();
    const [certsPass, setPass] = useState("")
    const [certDays, setCertDays] = useState("")
    const [caDays, setCaDays] = useState("")
    const [certHostname, setCertHostname] = useState(location.state.domainName)
    const [nickname, setNickname] = useState(location.state.nickname)
    const [showDownload, setShowDownload] = useState(false)
    const [showUpload, setShowUpload] = useState(true)
    const [multipleFiles, setMultipleFiles] = useState([])


    const idCluster = location.state.idCluster
    const domainName = location.state.domainName





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
            nickname: nickname
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
                nickname: nickname
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

    const sendInput = () => {
        if (!certsPass || !certHostname || !nickname) {
            M.toast({ html: "Empty fields", classes: "rounded red darken-3" })
            return
        }
        // if (caDays == null || certDays == null) {
        //     setCaDays("900")
        //     setCertDays("365")
        // }
        fetch("/EditApiInstance", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster,
                domainName: certHostname,
                nickname: nickname,
                caDays: caDays,
                certDays: certDays,
                certsPass: certsPass
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


    return (
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
                    <b id='white-text' style={{ fontStyle: 'italic', fontSize: '15px' }}>Nickname : {nickname}</b>
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

                    <button class="btn waves-effect waves-light green" type="submit" name="action" onClick={() => sendInput()}>Edit
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
                        {/* <i className="material-icons green-text " style={{
                        fontSize: '50px', cursor: 'pointer', textAlign: 'center'
                    }} onClick={(e) => download(e)}>file_download</i> */}

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
    )

}

export default EditInstance