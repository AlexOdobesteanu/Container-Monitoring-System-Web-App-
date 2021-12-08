const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')

require('./models/user')

app.use(express.json())
app.use(require("./routes/auth"))


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

app.listen(PORT, () => {
    console.log("server is running on", PORT)
})