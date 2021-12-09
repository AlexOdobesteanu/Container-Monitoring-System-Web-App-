const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const containerSchema = new mongoose.Schema({
    host: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    ownedBy: {
        type: ObjectId,
        ref: "User"
    }
})

mongoose.model("Container", containerSchema)