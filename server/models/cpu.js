const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const cpuSchema = new mongoose.Schema({
    forContainer:
        {
            type: ObjectId,
            ref: "Container"
        },
    usePercentage:
        {
            type: String,
            required: true,
        }
})

mongoose.model("cpuModel", cpuSchema)