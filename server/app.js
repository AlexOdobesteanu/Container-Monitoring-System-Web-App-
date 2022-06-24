const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()
const schedule = require('node-schedule')
var monitor = require("./monitoringdata")
var getData = require("./gettingData")


const PORT = 5000
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("connected to mongo")

    // let job = schedule.scheduleJob("0", "*/4 * * * * *", function () {
    //     var result = getData.gettingData()
    //     result.then(function (result) {
    //         for (i = 0; i < result.length; i++) {
    //             monitor.monitoringCont(result[i])
    //         }
    //     })

    // })

    // let job1 = schedule.scheduleJob("1", "*/4 * * * * *", function () {
    //     var resultNodes = getData.gettingDataNode()
    //     resultNodes.then(function (resultNodes) {
    //         for (i = 0; i < resultNodes.length; i++) {
    //             monitor.monitoringNode(resultNodes[i])
    //         }
    //     })
    // })

    // let job2 = schedule.scheduleJob("2", "*/4 * * * * *", function () {
    //     var resultAlerts = getData.gettingAlerts()
    //     resultAlerts.then(function (resultAlerts) {
    //         for (i = 0; i < resultAlerts.length; i++) {
    //             monitor.startAlertTasks(resultAlerts[i])
    //         }
    //     })
    // })

    // monitor.monitoringCont()
})

mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
})


require('./models/user')
require('./models/container')
require('./models/cpu')
require('./models/cluster')
require('./models/alert')
require('./models/alertNotification')
require('./models/generaldata')
require('./models/AlertHistory')
require('./models/Nodes')

app.use(express.json())
app.use(cors())
app.use(fileUpload())



app.use(require("./routes/auth"))
app.use(require('./routes/container'))
app.use(require('./routes/alerts'))
app.use(require('./routes/containerInteraction'))
app.use(require('./routes/containerStats'))
app.use(require('./routes/nodeInteraction'))
app.use(require('./routes/uploadDownload'))
app.use(require('./routes/cluster'))
app.use(require('./routes/dataCollecting'))


app.listen(PORT, () => {
    console.log("server is running on", PORT)

})
