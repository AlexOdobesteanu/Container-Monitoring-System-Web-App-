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


router.post('/GetProcesses', requireLogin, (req, res) => {
    const { idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })

    var container = mydocker.getContainer(idContainer)
    container.top({ ps_args: "-e" }, function (err, data) {
        res.json({ data });
        console.log(data)
    });
})

router.post('/FSChanges', requireLogin, (req, res) => {
    const { idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })

    var container = mydocker.getContainer(idContainer)
    container.changes(function (err, changes) {
        res.json({ changes })
    })
})

router.post('/GetServices', requireLogin, (req, res) => {
    const { domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })

    mydocker.listServices({ 'all': true }, function (err, containers) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ containers })
        }
    })
})

module.exports = router