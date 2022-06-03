const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const alertHistorySchema = new mongoose.Schema({
    ownedBy: {
        type: ObjectId,
        ref: "User"
    },
    idCluster:
    {
        type: ObjectId,
        ref: "Cluster"
    },
    ClusterName:
    {
        type: String
    },
    idContainer:
    {
        type: String,
        required: true
    },
    ContainerName:
    {
        type: String
    },
    TypeOfNotification:
    {
        type: String,
        required: true
    },
    ValueOver:
    {
        type: String
    },
    ValueSetByUser:
    {
        type: String
    },
    Message:
    {
        type: String,
        required: true
    },
    DateOfNotification:
    {
        type: Date,
        default: Date.now
    }
})

mongoose.model("AlertHistory", alertHistorySchema)