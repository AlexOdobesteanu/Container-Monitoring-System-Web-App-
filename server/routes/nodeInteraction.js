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



router.post('/GetNodes', requireLogin, (req, res) => {
    const { domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })

    mydocker.listNodes(function (err, nodes) {
        if (err) {
            console.log(err)
            res.json({ nodes: [] })
        }
        else {
            res.json({ nodes })
        }
    })
})



router.post('/nodeadd', requireLogin, (req, res) => {
    const { domainName, nickname, NodeID, idCluster } = req.body
    const nodes = new Nodes({
        domainName: domainName,
        nickname: nickname,
        ownedBy: req.user,
        NodeID: NodeID,
        idCluster: idCluster
    })
    nodes.save().then(result => {
        res.json({ nodes: result })
    })
        .catch(err => {
            console.log(err)
        })
})

async function getDockerContainers(domainName, nickname, id) {
    if (fs.existsSync('./configFiles/' + id + '/' + nickname + '/' + 'ca.pem') == false) {
        return []
        console.log("aaa")
    }
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + id + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + id + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + id + '/' + nickname + '/' + 'key.pem')
    })

    return await mydocker.listContainers({ all: true })
}

async function gatherData(domainName, nickname, id) {
    try {
        const allContainers = await getDockerContainers(domainName, nickname, id)
        if (allContainers == []) {
            return []
        }
        else {
            return allContainers
        }
    } catch (err) {
        console.log(err);
    }
}


router.post('/getnodeinfo', requireLogin, (req, res) => {
    const { idCluster } = req.body

    Nodes.find({ ownedBy: req.user, idCluster: idCluster })
        .populate("ownedBy idCluster", "_id  NodeID domainName nickname")
        .then(nodes => {
            let containers = []
            let allContainers = []
            for (let i = 0; i < nodes.length; i++) {
                let domainName = nodes[i].domainName
                let nickname = nodes[i].nickname
                let containersList = gatherData(domainName, nickname, req.user._id)
                containers.push(containersList)
            }
            if (nodes != null) {
                let domainName = nodes[0].idCluster.domainName
                let nickname = nodes[0].idCluster.nickname

                let containersList = getDockerContainers(domainName, nickname, req.user._id)
                containers.push(containersList)
            }

            if (containers == []) {
                res.json({ nodes, containers })
            }

            Promise.all(containers).then(container => {
                allContainers.push(container)
            })
                .then(() => {
                    res.json({ nodes, allContainers })
                })

        })
        .catch(err => {
            res.json({ nodes: [] })
        })
})


module.exports = router