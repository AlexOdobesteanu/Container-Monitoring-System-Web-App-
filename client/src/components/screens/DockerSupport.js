import React, { useState } from 'react'
import "../../App.css"
import axios from 'axios'
import fileDownload from 'js-file-download'
import M from 'materialize-css'
const yaml = require('js-yaml');
const fs = require('fs')


const DockerSupport = () => {
    const [certsPass, setPass] = useState("")
    const [certDays, setCertDays] = useState(null)
    const [caDays, setCaDays] = useState(null)
    const [certHostname, setCertHostname] = useState("")
    const [nickname, setNickname] = useState("")
    const [showDownload, setShowDownload] = useState(false)

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
        })


    }

    const sendInput = () => {
        if (!certsPass || !certHostname || !nickname) {
            M.toast({ html: "Empty fields", classes: "rounded red darken-3" })
            return
        }
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
                nickname: nickname
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
        <div style={{
            margin: "10px auto",
            maxWidth: "550px",
            padding: "20px",
            textAlign: "center"
        }}>
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
                    value={nickname} onChange={(e) => setNickname(e.target.value)}>

                </input>

                <button class="btn waves-effect waves-light green" type="submit" name="action" onClick={() => sendInput()}>Send info
                    <i class="material-icons right">send</i>
                </button>



            </div>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            {showDownload ? (
                <div>
                    <div class="card-panel ">
                        <span class="white-text">
                            docker-compose.yml
                        </span>
                    </div>
                    <br></br>
                    <i className="material-icons green-text " style={{
                        fontSize: '50px', cursor: 'pointer', textAlign: 'center'
                    }} onClick={(e) => download(e)}>file_download</i>
                </div>) : (<div></div>)}

        </div >
    )
}

export default DockerSupport