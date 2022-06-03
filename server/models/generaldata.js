const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const generaldataSchema = new mongoose.Schema({
    ownedBy: {
        type: ObjectId,
        ref: "User"
    },
    idCluster:
    {
        type: ObjectId,
        ref: "Cluster"
    },
    ClusterNickname:
    {
        type: String,
        required: true
    },
    idContainer:
    {
        type: String,
        required: true
    },
    ContainerName:
    {
        type: String,
        required: true
    },
    MemPerc:
    {
        type: [String]
    },
    MemUsed:
    {
        type: [String]
    },
    Cache: {
        type: [String]
    },
    CpuPerc: {
        type: [String]
    },
    UserMode: {
        type: [String]
    },
    KernelMode: {
        type: [String]
    },
    TxRxRate: {
        type: [String]
    },
    TxData: {
        type: [String]
    },
    RxData: {
        type: [String]
    },
    StatusChange:
    {
        type: [String]
    },
    TxDropped:
    {
        type: [String]
    },
    RxDropped:
    {
        type: [String]
    },
    TxError:
    {
        type: [String]
    },
    RxError:
    {
        type: [String]
    },
    DateOfNotification:
    {
        type: [Date],
        default: Date.now
    }
})

mongoose.model("GeneralData", generaldataSchema)