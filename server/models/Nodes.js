const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const NodesSchema = new mongoose.Schema({
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
    idCluster:
    {
        type: ObjectId,
        ref: "Cluster"
    },
    NodeID:
    {
        type: String,
        required: true,
    },
    ownedBy:
    {
        type: ObjectId,
        ref: "User"
    },
})

mongoose.model("Nodes", NodesSchema)