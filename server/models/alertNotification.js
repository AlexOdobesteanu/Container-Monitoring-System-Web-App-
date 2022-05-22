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
    idContainer:
    {
        type: String,
        required: true
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