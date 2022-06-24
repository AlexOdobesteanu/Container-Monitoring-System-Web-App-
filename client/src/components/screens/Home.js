import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import Typist from 'react-typist';
import logoCont from '../../logos/container.png'
import "../../App.css"


const Home = () => {
    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <p id="white-text" style={{ color: 'whitesmoke', fontSize: '40px', cursor: 'pointer' }}>
                    <Typist avgTypingDelay={60} cursor={{ hideWhenDone: true, blink: 'true' }}>
                        <p><b id="white-text" style={{ fontSize: '40px' }}>Web Platform for Container Monitoring.</b></p>
                        <Typist.Delay ms={500} />
                        <b id="blue-text" style={{ fontSize: '40px' }}>Created in ReactJS & NodeJS</b>
                    </Typist>

                </p>

            </div >
            <div style={{ textAlign: 'center' }}>

                <img src={logoCont} className='imgInverted' style={{ fill: 'white', stroke: 'white' }}></img>

            </div>
        </div >

    )

}

export default Home