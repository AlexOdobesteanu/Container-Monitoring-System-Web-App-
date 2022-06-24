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


router.post('/clusteradd', requireLogin, (req, res) => {
    const { domainName, nickname } = req.body
    const cluster = new Cluster({
        domainName: domainName,
        nickname: nickname,
        ownedBy: req.user
    })
    cluster.save().then(result => {
        res.json({ cluster: result })
    })
        .catch(err => {
            console.log(err)
        })
})


router.post('/GetClusterDetailsById', requireLogin, (req, res) => {
    const { idCluster } = req.body
    Cluster.find({ ownedBy: req.user._id, _id: idCluster })
        .populate("ownedBy _id", "domainName nickname")
        .then(mycluster => {
            res.json({ mycluster })
        })
        .catch(err => {
            console.log(err)
        })

})


router.post('/clusters', requireLogin, (req, res) => {

    Cluster.find({ ownedBy: req.user._id })
        .populate("ownedBy", "domainName nickname")
        .then(mycluster => {
            res.json({ mycluster })
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router