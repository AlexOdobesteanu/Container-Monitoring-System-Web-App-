const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Container = mongoose.model("Container")
const requireLogin = require('../middleware/requireLogin')

router.post('/addcontainer', requireLogin, (req, res) => {
    const { host, username, password } = req.body
    if (!host || !username || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    const container = new Container({
        host: host,
        username: username,
        password: password,
        ownedBy: req.user
    })
    container.save().then(result => {
        res.json({ container: result })
    })
        .catch(err => {
            console.log(err)
        })


})

module.exports = router

