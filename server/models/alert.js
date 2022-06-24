const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const alertSchema = new mongoose.Schema({
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
    ContainerName:
    {
        type: String,
    },
    NodeName:
    {
        type: String
    },
    idNode:
    {
        type: ObjectId,
        ref: "Nodes"
    },
    MemPercAlert:
    {
        type: String
    },
    MemUsedAlert:
    {
        type: String
    },
    CacheAlert: {
        type: String
    },
    CpuPercAlert: {
        type: String
    },
    UserModeAlert: {
        type: String
    },
    KernelModeAlert: {
        type: String
    },
    TxRxRateAlert: {
        type: String
    },
    TxDataAlert: {
        type: String
    },
    RxDataAlert: {
        type: String
    },
    StatusChangeAlert:
    {
        type: Boolean,
        default: false
    },
    PacketDroppedAlert:
    {
        type: Boolean,
        default: false
    },
    PacketErrorAlert:
    {
        type: Boolean,
        default: false
    }
})

mongoose.model("Alert", alertSchema)