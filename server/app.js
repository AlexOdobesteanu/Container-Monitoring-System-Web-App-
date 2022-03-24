const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()

const PORT = 5000
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})

mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
})


require('./models/user')
require('./models/container')
require('./models/cpu')
require('./models/cluster')


app.use(express.json())
app.use(cors())
app.use(fileUpload())



app.use(require("./routes/auth"))
app.use(require('./routes/container'))

app.listen(PORT, () => {
    console.log("server is running on", PORT)
})