const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const clusterSchema = new mongoose.Schema({
    domainName:
    {
        type: String,
        required: true,
    },
    nickname:
    {
        type: String,
        required: true,
    },
    ownedBy:
    {
        type: ObjectId,
        ref: "User"
    }
})

mongoose.model("Cluster", clusterSchema)

