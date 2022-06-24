const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const yaml = require('js-yaml');
const multer = require('multer')
var async = require('async')
var fs = require('fs')
var Docker = require('dockerode')
var cron = require('node-cron')
var crypto = require('crypto')
const schedule = require('node-schedule')
const Container = mongoose.model("Container")
const cpuModel = mongoose.model("cpuModel")
const Cluster = mongoose.model("Cluster")
const Alert = mongoose.model("Alert")
const Nodes = mongoose.model("Nodes")
const AlertNotification = mongoose.model("AlertNotification")
const GeneralData = mongoose.model("GeneralData")
const AlertHistory = mongoose.model("AlertHistory")
const requireLogin = require('../middleware/requireLogin')
const { SECRET } = require('../keys')
const { IV } = require('../keys')
const e = require('express')
const bcrypt = require('bcryptjs')
const path = require('path');
const { alertClasses } = require('@mui/material');
const { application } = require('express');


router.post('/StopContainer', requireLogin, (req, res) => {
    const { idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)
    container.stop((err, data) => {
        if (err) {
            return res.status(422).json({ error: "Container " + idContainer + " couldn't stop.Try again !" })
        }
        else {
            return res.status(422).json({ succes: "Container " + idContainer + " stopped !" })
        }
    })

})

router.post('/PauseContainer', requireLogin, (req, res) => {
    const { idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)
    container.pause(function (err, data) {
        console.log(err)
        // console.log(data.toString())
        if (err) {
            return res.status(422).json({ error: "Container " + idContainer + " couldn't pause.Try again !" })
        }
        else {
            return res.status(422).json({ succes: "Container " + idContainer + " paused !" })
        }
    })

})

router.post('/UnpauseContainer', requireLogin, (req, res) => {
    const { idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)
    container.unpause(function (err, data) {
        console.log(err)
        // console.log(data.toString())
        if (err) {
            return res.status(422).json({ error: "Container " + idContainer + " couldn't start.Try again !" })
        }
        else {
            return res.status(422).json({ succes: "Container " + idContainer + " unpaused !" })
        }
    })

})

router.post('/StartContainer', requireLogin, (req, res) => {
    const { idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)
    container.start(function (err, data) {

        if (err) {
            return res.status(422).json({ error: "Container " + idContainer + " couldn't start.Try again !" })
        }
        else {
            return res.status(422).json({ succes: "Container " + idContainer + " started !" })
        }
    })

})

module.exports = router