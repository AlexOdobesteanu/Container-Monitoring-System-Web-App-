import React, { useState, useEffect, useNavigate } from 'react'
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import M from "materialize-css"
import { HashLoader } from 'react-spinners';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { Parallax, Background } from 'react-parallax';
import "../../App.css"

const AllClusters = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])

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
                                    <p style={{ textAlign: 'left' }}>Domain name: <b style={{ color: 'rgb(76, 175, 80)' }}>{item.domainName}</b></p>
                                    <p style={{ textAlign: 'left' }}>Nickname chosen: <b style={{ color: 'rgb(76, 175, 80)' }}>{item.nickname}</b></p>
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