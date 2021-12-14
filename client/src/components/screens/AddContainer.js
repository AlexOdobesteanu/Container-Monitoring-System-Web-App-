import React, { useState } from 'react'
import M from 'materialize-css'
const { SECRET } = require('../../keys')
const { IV } = require('../../keys')


var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = SECRET,
    iv = IV;

function encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

const AddContainer = () => {
    const [host, setIpAddress] = useState("")
    const [username, setUser] = useState("")
    const [password, setPassword] = useState("")

    const PostContainer = () => {
        if (!/^((?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])[.]){3}(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/.test(host)) {
            M.toast({ html: "Invalid IP", classes: "rounded red darken-3" })
            return
        }
        fetch('/addcontainer', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                host,
                username,
                password: encrypt(password)
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded red darken-3' })
                }
                else {
                    M.toast({ html: "Container added successfully", classes: 'rounded green' })
                    //navigate('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="card input-field" style={{
            margin: "10px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" placeholder="insert IP"
                value={host} onChange={(e) => setIpAddress(e.target.value)}>

            </input>

            <input type="text" placeholder='username for container'
                value={username} onChange={(e) => setUser(e.target.value)}>

            </input>

            <input type="password" placeholder='password for container'
                value={password} onChange={(e) => setPassword(e.target.value)}>

            </input>

            <button class="btn waves-effect waves-light green"
                onClick={() => PostContainer()}>
                Submit Container
            </button>

        </div>
    )
}

export default AddContainer