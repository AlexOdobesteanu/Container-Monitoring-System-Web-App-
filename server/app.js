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

app.use(express.json())
app.use(cors())
app.use(fileUpload())



app.use(require("./routes/auth"))
app.use(require('./routes/container'))



app.listen(PORT, () => {
    console.log("server is running on", PORT)

})
