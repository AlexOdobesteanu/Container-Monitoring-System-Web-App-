const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')

app.listen(PORT, () => {
    console.log("server is running on", PORT)
})