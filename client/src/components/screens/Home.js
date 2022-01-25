import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';

const Home = () => {
    return (
        // <div className="home">
        //     <div className='card home-card'></div>
        //     <h5>Name</h5>
        //     <div class="parallax-container">
        //         <div class="parallax"><img src="img.jpg"></div>
        //     </div>
        // </div>
        <div>
            {/* <Parallax strength={300}>
                <Background className="custom-bg">
                    <img src={require('./image.png')} alt="fill murray" />
                </Background>
            </Parallax> */}
            <Parallax></Parallax>
        </div>
    )

}

export default Home