import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import Typist from 'react-typist';
import M from 'materialize-css'
import logoCont from '../../logos/container.png'
import "../../App.css"


const MyAccount = () => {
    const [password, setPassword] = useState("")
    const [passwordNew, setPasswordNew] = useState("")

    const PostData = () => {

        fetch("/changepass", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: JSON.parse(localStorage.getItem("user")).email,
                password: password,
                passwordNew: passwordNew
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message) {
                    M.toast({ html: data.message, classes: 'rounded green' })
                    // M.toast({ html: data.error, classes: 'rounded red darken-3' })
                }
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded red darken-3' })
                }
            }).catch(err => {
                console.log(err)
            })

    }
    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <p id="white-text" style={{ color: 'whitesmoke', fontSize: '40px', cursor: 'pointer' }}>
                    <Typist avgTypingDelay={60} cursor={{ hideWhenDone: true, blink: 'true' }}>
                        <p><b id="white-text" style={{ fontSize: '40px' }}>Configure your account</b></p>
                        <Typist.Delay ms={500} />
                        <b id="blue-text" style={{ fontSize: '40px' }}>Change Password</b>
                    </Typist>

                </p>

                <div className="mycard">
                    <div className="card auth-card input-field">
                        <input type="password" placeholder="old password" value={password}
                            onChange={(e) => setPassword(e.target.value)}>

                        </input>

                        <input type="password" placeholder="new password" value={passwordNew}
                            onChange={(e) => setPasswordNew(e.target.value)}>

                        </input>
                        <button class="btn waves-effect waves-light green" onClick={() => PostData()}>
                            Change Password
                        </button>


                    </div>
                </div>

            </div>
        </div >

    )

}

export default MyAccount