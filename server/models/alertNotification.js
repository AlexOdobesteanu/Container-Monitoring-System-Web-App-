const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const alertNotificationSchema = new mongoose.Schema({
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
        type: String,
    },
    idContainer:
    {
        type: String,
        required: true
    },
    NodeName:
    {
        type: String
    },
    NodeId:
    {
        type: String
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

mongoose.model("AlertNotification", alertNotificationSchema)