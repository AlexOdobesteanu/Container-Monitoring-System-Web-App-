import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import { HashLoader } from 'react-spinners';
import "../../App.css"

const ContainerData = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const location = useLocation();
    const idContainer = location.state.idContainer
    const domainName = location.state.domainName
    const nickname = location.state.nickname
    const [loading, setLoading] = useState(false)
    const [MyData, setData] = useState([])

    useEffect(() => {
        fetch("/containersfullinfo", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domainName: domainName,
                nickname: nickname,
                idContainer: idContainer
            })
        }).then(res => res.json())
            .then(result => {
                setData(result.data)
                setLoading(true)
                console.log(MyData)
                console.log(result.data)
            })
    }, [])

    return (
        <>
            {loading ? (<div class="col s12 m7" style={{
                margin: "40px auto",
                maxWidth: "1900px",
            }}>
                <div class="card horizontal" >
                    <div id='flex' style={{ width: '100%' }}>
                        <div class="card-content" style={{ width: '33%', textAlign: 'left', marginLeft: '150px' }}>
                            <p id='white-text-large'>Type: <b id='blue-text'>Container</b></p>
                            <p id='white-text-large'>Name: <b id='blue-text'>{MyData.Name}</b></p>
                            <p id='white-text-large'>Created: <b id='blue-text'>{MyData.Created}</b></p>
                            <p id='white-text-large'>Started At: <b id='blue-text'>{MyData.State['StartedAt']}</b></p>
                            <p id='white-text-large'>PID: <b id='blue-text'>{MyData.State['Pid']}</b></p>
                            <p id='white-text-large'>Platform: <b id='blue-text'>{MyData.Platform}</b></p>
                            <p id='white-text-large'>Status: <b id='blue-text'>{MyData.State['Status']}</b></p>
                        </div>
                        <div class="card-content" style={{ width: '33%', textAlign: 'left' }}>
                            <p id='white-text-large'>Type: <b id='blue-text'>Container</b></p>
                            <p id='white-text-large'>Name: <b id='blue-text'>{MyData.Name}</b></p>
                            <p id='white-text-large'>Created: <b id='blue-text'>{MyData.Created}</b></p>
                            <p id='white-text-large'>Started At: <b id='blue-text'>{MyData.State['StartedAt']}</b></p>
                            <p id='white-text-large'>PID: <b id='blue-text'>{MyData.State['Pid']}</b></p>
                            <p id='white-text-large'>Platform: <b id='blue-text'>{MyData.Platform}</b></p>
                            <p id='white-text-large'>Status: <b id='blue-text'>{MyData.State['Status']}</b></p>
                        </div>
                        <div class="card-content" style={{ width: '33%', textAlign: 'left' }}>
                            <p id='white-text-large'>Type: <b id='blue-text'>Container</b></p>
                            <p id='white-text-large'>Name: <b id='blue-text'>{MyData.Name}</b></p>
                            <p id='white-text-large'>Created: <b id='blue-text'>{MyData.Created}</b></p>
                            <p id='white-text-large'>Started At: <b id='blue-text'>{MyData.State['StartedAt']}</b></p>
                            <p id='white-text-large'>PID: <b id='blue-text'>{MyData.State['Pid']}</b></p>
                            <p id='white-text-large'>Platform: <b id='blue-text'>{MyData.Platform}</b></p>
                            <p id='white-text-large'>Status: <b id='blue-text'>{MyData.State['Status']}</b></p>
                        </div>
                    </div>
                </div>

            </div>) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)}

        </>
    )

}

export default ContainerData