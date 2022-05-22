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
    idContainer:
    {
        type: String,
        required: true
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