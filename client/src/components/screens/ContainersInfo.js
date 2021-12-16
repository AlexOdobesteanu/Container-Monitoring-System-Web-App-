import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import M from 'materialize-css'

const ContainersInfo = () => {
    const [data, setData] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    if (location.state == null) {
        console.log("BA")
        navigate('/')
    }
    const { idContainer } = location.state;




    useEffect(() => {
        fetch("/info", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idContainer: idContainer
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result.mycontainerInfo)
                setData(result.mycontainerInfo)
            })
    }, [])


    return (
        <div class="col s12 m7" style={{
            margin: "50px auto",
            maxWidth: "900px",
            textAlign: "center"
        }}>
            {
                data.map(item => {
                    return (
                        <div class="card horizontal" key={item._id}>
                            <div class="card-image">
                            </div>
                            <div class="card-stacked">
                                <div class="card-content">
                                    <p>
                                        Type: Container
                                    </p>
                                    <p>IP Address: {item.host}</p>
                                    <p>Username for Container: {item.username}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div >

    )
}

export default ContainersInfo