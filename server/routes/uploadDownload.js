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



router.post("/dockersupp", requireLogin, (req, res) => {
    const hostname = req.body.hostname
    const caDays = req.body.caDays
    const certDays = req.body.certDays
    const certsPass = req.body.certsPass
    const nickname = req.body.nickname
    const id = req.user._id.toString()


    const dir = './configFiles/' + id

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    const dir_aux = dir + '/' + nickname
    if (!fs.existsSync(dir_aux)) {
        fs.mkdirSync(dir_aux)
    }
    else {
        return res.status(422).json({ error: "nickname already used" })
    }


    let data = {
        version: "3.4",
        services: {
            "remote-api": {
                image: "kekru/docker-remote-api-tls:v0.4.0",
                ports: [
                    "2376:443"
                ],
                environment: [
                    "CREATE_CERTS_WITH_PW=" + certsPass,
                    "CERT_EXPIRATION_DAYS=" + certDays,
                    "CA_EXPIRATION_DAYS=" + caDays,
                    "CERT_HOSTNAME=" + hostname.split("https://")[1]
                ],
                volumes: [
                    "/data/certs",
                    "/var/run/docker.sock:/var/run/docker.sock:ro"
                ]

            }
        }
    }
    const dir_yml = dir_aux + '/docker-compose.yml'
    let yamlStr = yaml.safeDump(data)
    fs.writeFileSync(dir_yml, yamlStr, 'utf8')
    return res.status(201).json({ succes: "created" })
})

router.get("/download", requireLogin, (req, res) => {
    let nick = req.query.nickname
    // console.log("aaa")
    // console.log(nick)
    const id = req.user._id.toString()
    res.download("./configFiles/" + id + "/" + nick + "/docker-compose.yml")
})


router.post("/multiple", requireLogin, (req, res) => {
    console.log("aaa")
    const files = req.files.files
    console.log(files)
    console.log(req.user._id.toString())
    console.log(req.query)

    if (files.length != 3) {
        return res.status(422).json({ error: "Upload key.pem, cert.pem, ca.pem" })
    }
    else {
        files.forEach(file => {
            // console.log(file)
            const savePath = "./configFiles/" + req.user._id.toString() + '/' + req.query.nickname + '/' + file.name
            file.mv(savePath)
        })
        return res.status(201).json({ succes: "Uploaded successfully" })
    }
})


router.post("/EditApiInstance", requireLogin, (req, res) => {
    const { idCluster, domainName, nickname, certsPass, certDays, caDays } = req.body
    const id = req.user._id.toString()
    const dir = './configFiles/' + id
    console.log(idCluster)

    const dir_aux = dir + '/' + nickname

    let data = {
        version: "3.4",
        services: {
            "remote-api": {
                image: "kekru/docker-remote-api-tls:v0.4.0",
                ports: [
                    "2376:443"
                ],
                environment: [
                    "CREATE_CERTS_WITH_PW=" + certsPass,
                    "CERT_EXPIRATION_DAYS=" + certDays,
                    "CA_EXPIRATION_DAYS=" + caDays,
                    "CERT_HOSTNAME=" + domainName.split("https://")[1]
                ],
                volumes: [
                    "/data/certs",
                    "/var/run/docker.sock:/var/run/docker.sock:ro"
                ]
            }
        }
    }

    const dir_yml = dir_aux + '/docker-compose.yml'
    let yamlStr = yaml.safeDump(data)
    fs.writeFileSync(dir_yml, yamlStr, 'utf8')
    Cluster.findOneAndUpdate({ ownedBy: req.user._id, _id: idCluster },
        {
            $set: {
                domainName: domainName
            }
        })
        .then(mycluster => {
            return res.status(201).json({ succes: "created and edited" })


        })
        .catch(err => {
            return res.status(422).json({ error: "Error Adding" })
        })

})



router.post("/EditNode", requireLogin, (req, res) => {
    const { idCluster, domainName, NodeID, nickname, certsPass, certDays, caDays } = req.body
    const id = req.user._id.toString()
    const dir = './configFiles/' + id
    console.log(idCluster)

    const dir_aux = dir + '/' + nickname

    console.log(nickname)

    let data = {
        version: "3.4",
        services: {
            "remote-api": {
                image: "kekru/docker-remote-api-tls:v0.4.0",
                ports: [
                    "2376:443"
                ],
                environment: [
                    "CREATE_CERTS_WITH_PW=" + certsPass,
                    "CERT_EXPIRATION_DAYS=" + certDays,
                    "CA_EXPIRATION_DAYS=" + caDays,
                    "CERT_HOSTNAME=" + domainName.split("https://")[1]
                ],
                volumes: [
                    "/data/certs",
                    "/var/run/docker.sock:/var/run/docker.sock:ro"
                ]
            }
        }
    }

    const dir_yml = dir_aux + '/docker-compose.yml'
    let yamlStr = yaml.safeDump(data)
    fs.writeFileSync(dir_yml, yamlStr, 'utf8')
    Nodes.findOneAndUpdate({ ownedBy: req.user._id, idCluster: idCluster, NodeID: NodeID },
        {
            $set: {
                domainName: domainName
            }
        })
        .then(mycluster => {
            return res.status(201).json({ succes: "created and edited" })


        })
        .catch(err => {
            console.log(err)
            return res.status(422).json({ error: err })

        })

})



module.exports = router