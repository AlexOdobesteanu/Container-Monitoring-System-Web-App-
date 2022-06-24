const mongoose = require('mongoose')
require('./models/cluster')
const Cluster = mongoose.model("Cluster")
require('./models/Nodes')
const Nodes = mongoose.model("Nodes")
require('./models/alert')
const Alert = mongoose.model("Alert")

const gettingData = async () => {
    return await Cluster.find({});
}

const gettingDataNode = async () => {
    return await Nodes.find({})
}

const gettingAlerts = async () => {
    return await Alert.find({})
}

module.exports = { gettingData, gettingDataNode, gettingAlerts }