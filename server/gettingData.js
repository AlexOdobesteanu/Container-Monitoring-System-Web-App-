const mongoose = require('mongoose')
require('./models/cluster')
const Cluster = mongoose.model("Cluster")

const gettingData = async () => {

    return await Cluster.find({});

}

module.exports = { gettingData }