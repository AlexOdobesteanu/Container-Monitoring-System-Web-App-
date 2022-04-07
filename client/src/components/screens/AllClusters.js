import React, { useState, useEffect, useNavigate } from 'react'
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import M from "materialize-css"
import axios from 'axios'
import fileDownload from 'js-file-download'
import { HashLoader } from 'react-spinners';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { Parallax, Background } from 'react-parallax';
import "../../App.css"

const AllClusters = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const [loading, setLoading] = useState(false);
    const [containersData, setcontainersData] = useState([])
    const [data, setData] = useState([])

    function download(nick) {
        axios({
            url: "/download",
            method: "GET",
            responseType: "blob",
            params: {
                nickname: nick
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

    useEffect(() => {

        fetch('/clusters',
            {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }
        ).then(res => res.json())
            .then(result => {
                //console.log(result.mycontainer)
                setData(result.mycluster)
                setLoading(true);
            })

    }, [])
    return (
        <>
            {loading ? (<div class="col s12 m7" style={{
                margin: "50px auto",
                maxWidth: "900px",
                textAlign: "center"
            }}>
                <Collapsible popout>
                    {
                        data.map(item => {

                            return (
                                // <div class="card horizontal" key={item._id}>
                                //     <div class="card-stacked">
                                //         <div class="card-content">
                                //             <p id='white-text'>
                                //                 Type: Container
                                //             </p>
                                //             <p id='white-text'>IP Address: {item.domainName}</p>
                                //             <p id='white-text'>Username for Container: {item.nickname}</p>
                                //         </div>
                                //         <div class="card-action">
                                //             <Link to="/" id='green-text'>View
                                //                 details
                                //             </Link>
                                //         </div>
                                //     </div>
                                // </div>

                                <CollapsibleItem
                                    expanded={false}
                                    header={item.nickname}
                                    icon={<Icon>filter_drama</Icon>}
                                    node="div"
                                >
                                    <p style={{ textAlign: 'left' }}>Domain name: <b id='blue-text'>{item.domainName}</b></p>
                                    <p style={{ textAlign: 'left' }}>Nickname chosen: <b id='blue-text'>{item.nickname}</b></p>
                                    <button class="btn waves-effect waves-light" id='blue-button' onClick={() => download(item.nickname)}>
                                        Config file (.yaml)
                                        <i class="material-icons right">file_download</i>
                                    </button>
                                    <br></br>
                                    <br></br>
                                    <Link to="/clusterinfo" state={{
                                        idCluster: item._id,
                                        domainName: item.domainName,
                                        nickname: item.nickname
                                    }}>
                                        <button class="btn waves-effect waves-light green" id='blue-button'>View Full Details</button>
                                    </Link>
                                </CollapsibleItem>

                            )
                        })
                    }
                </Collapsible>

            </div>) : (<div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>)
            }

        </>
    )

}

export default AllClusters