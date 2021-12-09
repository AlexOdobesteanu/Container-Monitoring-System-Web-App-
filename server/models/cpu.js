const mongoose = require('mongoose')

const cpuSchema = new mongoose.Schema({
    usePercentage: {
        type: Number,
        required: true,
    }
})

mongoose.model("Cpu", cpuSchema)