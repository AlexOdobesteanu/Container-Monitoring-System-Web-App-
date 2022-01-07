import React from 'react'
import {Bar} from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'
import {Chart} from 'react-chartjs-2'

const Home = () => {
    return (
        <div className="home">
            <div className='card home-card'></div>
            <h5>Name</h5>
            <div></div>
            <Bar data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    data: [100, 200, 300, 400, 500, 600]
                }]
            }} height={400} width={600}/>
        </div>
    )

}

export default Home