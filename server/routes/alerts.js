const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var nodemailer = require('nodemailer');
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


router.delete('/AlertsNotificationsDeleteAll', requireLogin, (req, res) => {
    AlertNotification.deleteMany({}, function (err) {
        if (err) {
            return res.status(422).json({ error: "Delete failed.Try Again Later" })
        }
        else {
            return res.status(201).json({ succes: "Deleted All Successfully" })
        }
    })

})

router.delete('/AlertsNotificationsDelete', requireLogin, (req, res) => {
    const { id } = req.body
    console.log(id)
    AlertNotification.findOne({ _id: id })
        .populate("_id", "_id")
        .exec((err, alertNotification) => {
            if (err || !alertNotification) {
                return res.status(422).json({ error: err })
            }
            else {
                alertNotification.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })

})

router.post('/GetAlertsForContainer', requireLogin, (req, res) => {
    const { idCluster, idContainer } = req.body
    AlertNotification.find({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer })
        .populate("ownedBy idCluster idContainer", "_id TypeOfNotification ValueOver ValueSetByUser Message DateOfNotification")
        .then(containerNotifications => {
            res.json({ containerNotifications })
        })
        .catch(err => {
            console.log(err)
        })


})


router.post('/GetAlertsHistory', requireLogin, (req, res) => {
    let dates_array = []

    AlertHistory.find({ ownedBy: req.user._id })
        .populate("ownedBy", "_id idCluster ClusterName idContainer ContainerName NodeId NodeName TypeOfNotification ValueOver ValueSetByUser Message DateOfNotification")
        .then(myalerthistories => {
            let sortedArray = []
            for (let i = 0; i < myalerthistories.length; i++) {
                var dateObj = new Date(myalerthistories[i].DateOfNotification)
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                newdate = year + "/" + month + "/" + day;
                dates_array.push(newdate)
            }

            const un = [...new Set(dates_array)]

            for (let i = 0; i < un.length; i++) {
                let aux = []

                for (let j = 0; j < myalerthistories.length; j++) {
                    var dateObj = new Date(myalerthistories[j].DateOfNotification)
                    var month = dateObj.getUTCMonth() + 1; //months from 1-12
                    var day = dateObj.getUTCDate();
                    var year = dateObj.getUTCFullYear();
                    newdate = year + "/" + month + "/" + day;
                    if (newdate == un[i]) {
                        aux.push(myalerthistories[j])
                    }
                }
                sortedArray[un[i]] = aux
            }
            var resp = Object.keys(sortedArray).map((key) => [(key), sortedArray[key]])
            res.json({ resp })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/AlertsNotifications', requireLogin, (req, res) => {
    AlertNotification.find({ ownedBy: req.user._id })
        .populate("ownedBy", "_id idCluster ClusterName NodeId NodeName idContainer ContainerName TypeOfNotification ValueOver ValueSetByUser Message DateOfNotification")
        .then(myalertnotifications => {
            res.json({ myalertnotifications })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/GetAlerts', requireLogin, (req, res) => {
    const { idContainer, idCluster } = req.body
    Alert.findOne({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer })
        .populate("ownedBy idCluster idContainer", "MemPercAlert MemUsedAlert CacheAlert CpuPercAlert UserModeAlert KernelModeAlert TxRxRateAlert TxDataAlert RxDataAlert StatusChangeAlert PacketDroppedAlert PacketErrorAlert")
        .then(myalert => {
            if (myalert == null) {
                console.log('null baaa')
                return res.status(422).json({ error: "Alerts not configured" })
            }
            else {
                res.json({ myalert })
            }
        })
        .catch(err => {
            console.log(err)
        })
})




//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

router.post("/AlertConfigure", requireLogin, (req, res) => {
    console.log('aaa')
    let found = true
    const { idCluster, NodeName, ClusterName, idContainer, ContainerName, MemPercAlert, MemUsedAlert, CacheAlert, CpuPercAlert
        , UserModeAlert, KernelModeAlert, TxRxRateAlert, TxDataAlert, RxDataAlert
        , StatusChangeAlert, PacketDroppedAlert, PacketErrorAlert, domainName, nickname } = req.body

    let { idNode } = req.body

    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)

    if (idNode == "") {
        idNode = null
    }

    Alert.findOne({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer, NodeName: NodeName })
        .populate("ownedBy idCluster idContainer idNode", "ClusterName NodeName MemPercAlert MemUsedAlert CacheAlert CpuPercAlert UserModeAlert KernelModeAlert TxRxRateAlert TxDataAlert RxDataAlert StatusChangeAlert PacketDroppedAlert PacketErrorAlert")
        .then(myalert => {
            if (myalert == null) {
                found = false
                const alert = new Alert({
                    ownedBy: req.user,
                    idCluster: idCluster,
                    ClusterName: ClusterName,
                    NodeName: NodeName,
                    idNode: idNode,
                    idContainer: idContainer,
                    ContainerName: ContainerName,
                    MemPercAlert: MemPercAlert,
                    MemUsedAlert: MemUsedAlert,
                    CacheAlert: CacheAlert,
                    CpuPercAlert: CpuPercAlert,
                    UserModeAlert: UserModeAlert,
                    KernelModeAlert: KernelModeAlert,
                    TxRxRateAlert: TxRxRateAlert,
                    TxDataAlert: TxDataAlert,
                    RxDataAlert: RxDataAlert,
                    StatusChangeAlert: StatusChangeAlert,
                    PacketDroppedAlert: PacketDroppedAlert,
                    PacketErrorAlert: PacketErrorAlert
                })
                alert.save().then(result => {

                })

                let custom_id = req.user._id.toString() + idCluster + idContainer + idNode

                hashed_id = crypto.createHash('md5').update(custom_id).digest('hex').toString()
                let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
                    let validator = true


                    console.log("running a task new for user " + req.user._id.toString() + "and cluster " + idCluster);

                    container.inspect(function (err, data) {
                        if (StatusChangeAlert == true) {
                            if (data.State['Status'] != 'running') {
                                validator = false
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Container Status Changed (Stopped)",
                                    Message: 'Container stopped'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })
                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    ContainerName: ContainerName,
                                    TypeOfNotification: "Container Status Changed (Stopped)",
                                    Message: 'Container stopped'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })


                            }
                            else {
                                validator = true
                            }
                        }
                    })

                    if (validator == true) {
                        container.stats({ stream: false }, function (err, data) {
                            // console.log(data)


                            if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(MemPercAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Memory Usage % ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                    ValueSetByUser: MemPercAlert,
                                    Message: 'Memory Usage % threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Memory Usage % ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                    ValueSetByUser: MemPercAlert,
                                    Message: 'Memory Usage % threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })
                            }
                            if (parseFloat(data.memory_stats['usage']) / 1000000 >= parseFloat(MemUsedAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Memory Usage ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                    ValueSetByUser: MemUsedAlert,
                                    Message: 'Memory Usage threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Memory Usage ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                    ValueSetByUser: MemUsedAlert,
                                    Message: 'Memory Usage threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (data.memory_stats.length != undefined) {
                                if ((parseFloat(data.memory_stats.stats['total_cache'] / 1000000)) >= (parseFloat(CacheAlert))) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Cache ALERT",
                                        ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                        ValueSetByUser: CacheAlert,
                                        Message: 'Cache threshold exceeded'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })


                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Cache ALERT",
                                        ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                        ValueSetByUser: CacheAlert,
                                        Message: 'Cache threshold exceeded'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                            }

                            let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                            let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)

                            if (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100)) >= parseFloat(CpuPercAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "CPU Usage % ALERT",
                                    ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                    ValueSetByUser: CpuPercAlert,
                                    Message: 'CPU Percentage threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "CPU Usage % ALERT",
                                    ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                    ValueSetByUser: CpuPercAlert,
                                    Message: 'CPU Percentage threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(UserModeAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "CPU Usage User Mode % ALERT",
                                    ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                    ValueSetByUser: UserModeAlert,
                                    Message: 'CPU User Mode Percentage threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "CPU Usage User Mode % ALERT",
                                    ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                    ValueSetByUser: UserModeAlert,
                                    Message: 'CPU User Mode Percentage threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(KernelModeAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                    ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                    ValueSetByUser: KernelModeAlert,
                                    Message: 'CPU Kernel Mode Percentage threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                    ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                    ValueSetByUser: KernelModeAlert,
                                    Message: 'CPU Kernel Mode Percentage threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (data.networks != undefined) {
                                if (parseFloat(data.networks.eth0['tx_bytes'] / data.networks.eth0['rx_bytes']) >= parseFloat(TxRxRateAlert)) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx/Rx Rate ALERT",
                                        ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                        ValueSetByUser: TxRxRateAlert,
                                        Message: 'Tx/Rx Rate threshold exceeded'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx/Rx Rate ALERT",
                                        ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                        ValueSetByUser: TxRxRateAlert,
                                        Message: 'Tx/Rx Rate threshold exceeded'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000) >= parseFloat(TxDataAlert)) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Network Tx MiB ALERT",
                                        ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                        ValueSetByUser: TxDataAlert,
                                        Message: 'Tx MiB threshold exceeded'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Network Tx MiB ALERT",
                                        ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                        ValueSetByUser: TxDataAlert,
                                        Message: 'Tx MiB threshold exceeded'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000) >= parseFloat(RxDataAlert)) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Network Rx MiB ALERT",
                                        ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                        ValueSetByUser: RxDataAlert,
                                        Message: 'Rx MiB threshold exceeded'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Network Rx MiB ALERT",
                                        ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                        ValueSetByUser: RxDataAlert,
                                        Message: 'Rx MiB threshold exceeded'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (PacketDroppedAlert == true) {
                                    if (parseFloat(data.networks.eth0['rx_dropped']) != 0) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Rx Packet Dropped",
                                            ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Rx Packet dropped'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Rx Packet Dropped",
                                            ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Rx Packet dropped'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (parseFloat(data.networks.eth0['tx_dropped']) != 0) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Tx Packet Dropped",
                                            ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Tx Packet dropped'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Tx Packet Dropped",
                                            ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Tx Packet dropped'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                }
                                if (PacketErrorAlert == true) {
                                    if (parseFloat(data.networks.eth0['rx_errors']) != 0) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Rx Packet Error",
                                            ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Rx Packet Error'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })


                                        const alertHistory = new AlertHistory({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Rx Packet Error",
                                            ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Rx Packet Error'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (parseFloat(data.networks.eth0['tx_errors']) != 0) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Tx Packet Error",
                                            ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Tx Packet Error'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: req.user,
                                            idCluster: idCluster,
                                            ClusterName: ClusterName,
                                            idContainer: idContainer,
                                            ContainerName: ContainerName,
                                            NodeId: idNode,
                                            NodeName: NodeName,
                                            TypeOfNotification: "Tx Packet Error",
                                            ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                            ValueSetByUser: 0,
                                            Message: 'Tx Packet Error'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                }

                            }
                        });
                    }


                });

            }
        })
        .catch(err => {
            console.log(err)
        })
    if (found == true) {
        Alert.findOneAndUpdate({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer, idNode: idNode },
            {
                $set: {
                    MemPercAlert: MemPercAlert,
                    MemUsedAlert: MemUsedAlert,
                    CacheAlert: CacheAlert,
                    CpuPercAlert: CpuPercAlert,
                    UserModeAlert: UserModeAlert,
                    KernelModeAlert: KernelModeAlert,
                    TxRxRateAlert: TxRxRateAlert,
                    TxDataAlert: TxDataAlert,
                    RxDataAlert: RxDataAlert,
                    StatusChangeAlert: StatusChangeAlert,
                    PacketDroppedAlert: PacketDroppedAlert,
                    PacketErrorAlert: PacketErrorAlert
                }
            })
            .then(myalert => {
                res.json({ myalert })


            })
            .catch(err => {
                return res.status(422).json({ error: "Error Adding Alert" })
            })
        let custom_id = req.user._id.toString() + idCluster + idContainer + idNode
        hashed_id = crypto.createHash('md5').update(custom_id).digest('hex').toString()
        let current_job = schedule.scheduledJobs[hashed_id]
        if (current_job == null) {
            let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
                let validator = true
                console.log("running a task new for user " + req.user._id.toString() + "and cluster " + idCluster);
                container.inspect(function (err, data) {
                    if (StatusChangeAlert == true) {
                        if (data.State['Status'] != 'running') {
                            validator = false
                            console.log('aici se schimba')
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Container Status Changed (Stopped)",
                                Message: 'Container stopped'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Container Status Changed (Stopped)",
                                Message: 'Container stopped'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        else {
                            validator = true
                        }
                    }
                })

                if (validator != false) {
                    container.stats({ stream: false }, function (err, data) {
                        // console.log(data)


                        if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(MemPercAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage % ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                ValueSetByUser: MemPercAlert,
                                Message: 'Memory Usage % threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })


                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage % ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                ValueSetByUser: MemPercAlert,
                                Message: 'Memory Usage % threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })
                        }
                        if (parseFloat(data.memory_stats['usage']) / 1000000 >= parseFloat(MemUsedAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                ValueSetByUser: MemUsedAlert,
                                Message: 'Memory Usage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                ValueSetByUser: MemUsedAlert,
                                Message: 'Memory Usage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }

                        if (data.memory_stats.length != undefined) {
                            if ((parseFloat(data.memory_stats.stats['total_cache'] / 1000000)) >= (parseFloat(CacheAlert))) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Cache ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                    ValueSetByUser: CacheAlert,
                                    Message: 'Cache threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Cache ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                    ValueSetByUser: CacheAlert,
                                    Message: 'Cache threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                        }

                        let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                        let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)

                        if (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100)) >= parseFloat(CpuPercAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage % ALERT",
                                ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                ValueSetByUser: CpuPercAlert,
                                Message: 'CPU Percentage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage % ALERT",
                                ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                ValueSetByUser: CpuPercAlert,
                                Message: 'CPU Percentage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(UserModeAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage User Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: UserModeAlert,
                                Message: 'CPU User Mode Percentage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage User Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: UserModeAlert,
                                Message: 'CPU User Mode Percentage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(KernelModeAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: KernelModeAlert,
                                Message: 'CPU Kernel Mode Percentage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: KernelModeAlert,
                                Message: 'CPU Kernel Mode Percentage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (data.networks != undefined) {
                            if (parseFloat(data.networks.eth0['tx_bytes'] / data.networks.eth0['rx_bytes']) >= parseFloat(TxRxRateAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Tx/Rx Rate ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                    ValueSetByUser: TxRxRateAlert,
                                    Message: 'Tx/Rx Rate threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Tx/Rx Rate ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                    ValueSetByUser: TxRxRateAlert,
                                    Message: 'Tx/Rx Rate threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000) >= parseFloat(TxDataAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Tx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: TxDataAlert,
                                    Message: 'Tx MiB threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Tx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: TxDataAlert,
                                    Message: 'Tx MiB threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000) >= parseFloat(RxDataAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Rx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: RxDataAlert,
                                    Message: 'Rx MiB threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })


                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Rx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: RxDataAlert,
                                    Message: 'Rx MiB threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (PacketDroppedAlert == true) {
                                if (parseFloat(data.networks.eth0['rx_dropped']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet dropped'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet dropped'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (parseFloat(data.networks.eth0['tx_dropped']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet dropped'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet dropped'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                            }
                            if (PacketErrorAlert == true) {
                                if (parseFloat(data.networks.eth0['rx_errors']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet Error'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet Error'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (parseFloat(data.networks.eth0['tx_errors']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet Error'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet Error'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                            }

                        }

                    });
                }

            })
        }
        else {
            current_job.cancel()
            let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
                let validator = true
                console.log("SCHIMBAAAAAAAAAAAAAAAAAAAA")
                console.log("running a task new for user " + req.user._id.toString() + "and cluster " + idCluster);
                container.stats({ stream: false }, function (err, data) {
                    // console.log(data)
                    console.log("running a task new for user " + req.user._id.toString() + "and cluster " + idCluster);

                    container.inspect(function (err, data) {
                        if (StatusChangeAlert == true) {
                            if (data.State['Status'] != 'running') {
                                validator = false
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Container Status Changed (Stopped)",

                                    Message: 'Container stopped'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Container Status Changed (Stopped)",
                                    Message: 'Container stopped'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            else {
                                validator = true
                            }
                        }
                    })

                    if (validator == true) {
                        if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(MemPercAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage % ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                ValueSetByUser: MemPercAlert,
                                Message: 'Memory Usage % threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage % ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                ValueSetByUser: MemPercAlert,
                                Message: 'Memory Usage % threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })
                        }
                        if (parseFloat(data.memory_stats['usage']) / 1000000 >= parseFloat(MemUsedAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                ValueSetByUser: MemUsedAlert,
                                Message: 'Memory Usage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "Memory Usage ALERT",
                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                ValueSetByUser: MemUsedAlert,
                                Message: 'Memory Usage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })



                        }


                        if (data.memory_stats.length != undefined) {
                            if ((parseFloat(data.memory_stats.stats['total_cache'] / 1000000)) >= (parseFloat(CacheAlert))) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Cache ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                    ValueSetByUser: CacheAlert,
                                    Message: 'Cache threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Cache ALERT",
                                    ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                    ValueSetByUser: CacheAlert,
                                    Message: 'Cache threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })
                            }
                        }


                        let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                        let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)

                        if (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100)) >= parseFloat(CpuPercAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage % ALERT",
                                ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                ValueSetByUser: CpuPercAlert,
                                Message: 'CPU Percentage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage % ALERT",
                                ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                ValueSetByUser: CpuPercAlert,
                                Message: 'CPU Percentage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(UserModeAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage User Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: UserModeAlert,
                                Message: 'CPU User Mode Percentage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage User Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: UserModeAlert,
                                Message: 'CPU User Mode Percentage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(KernelModeAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: KernelModeAlert,
                                Message: 'CPU Kernel Mode Percentage threshold exceeded'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                            const alertHistory = new AlertHistory({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: ClusterName,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                NodeId: idNode,
                                NodeName: NodeName,
                                TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                ValueSetByUser: KernelModeAlert,
                                Message: 'CPU Kernel Mode Percentage threshold exceeded'
                            })
                            alertHistory.save().then(result => {
                                res.json({ alertHistory: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (data.networks != undefined) {
                            if (parseFloat(data.networks.eth0['tx_bytes'] / data.networks.eth0['rx_bytes']) >= parseFloat(TxRxRateAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Tx/Rx Rate ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                    ValueSetByUser: TxRxRateAlert,
                                    Message: 'Tx/Rx Rate threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Tx/Rx Rate ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                    ValueSetByUser: TxRxRateAlert,
                                    Message: 'Tx/Rx Rate threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000) >= parseFloat(TxDataAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Tx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: TxDataAlert,
                                    Message: 'Tx MiB threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Tx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: TxDataAlert,
                                    Message: 'Tx MiB threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000) >= parseFloat(RxDataAlert)) {
                                const alertNotification = new AlertNotification({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Rx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: RxDataAlert,
                                    Message: 'Rx MiB threshold exceeded'
                                })
                                alertNotification.save().then(result => {
                                    res.json({ alertNotification: result })
                                })
                                    .catch(err => {

                                    })

                                const alertHistory = new AlertHistory({
                                    ownedBy: req.user,
                                    idCluster: idCluster,
                                    ClusterName: ClusterName,
                                    idContainer: idContainer,
                                    ContainerName: ContainerName,
                                    NodeId: idNode,
                                    NodeName: NodeName,
                                    TypeOfNotification: "Network Rx MiB ALERT",
                                    ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                    ValueSetByUser: RxDataAlert,
                                    Message: 'Rx MiB threshold exceeded'
                                })
                                alertHistory.save().then(result => {
                                    res.json({ alertHistory: result })
                                })
                                    .catch(err => {

                                    })

                            }
                            if (PacketDroppedAlert == true) {
                                if (parseFloat(data.networks.eth0['rx_dropped']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet dropped'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet dropped'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (parseFloat(data.networks.eth0['tx_dropped']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet dropped'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet dropped'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                            }
                            if (PacketErrorAlert == true) {
                                if (parseFloat(data.networks.eth0['rx_errors']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet Error'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })

                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Rx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Rx Packet Error'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                                if (parseFloat(data.networks.eth0['tx_errors']) != 0) {
                                    const alertNotification = new AlertNotification({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet Error'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })


                                    const alertHistory = new AlertHistory({
                                        ownedBy: req.user,
                                        idCluster: idCluster,
                                        ClusterName: ClusterName,
                                        idContainer: idContainer,
                                        ContainerName: ContainerName,
                                        NodeId: idNode,
                                        NodeName: NodeName,
                                        TypeOfNotification: "Tx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                        ValueSetByUser: 0,
                                        Message: 'Tx Packet Error'
                                    })
                                    alertHistory.save().then(result => {
                                        res.json({ alertHistory: result })
                                    })
                                        .catch(err => {

                                        })

                                }
                            }

                        }

                    }

                });

            });
        }
    }

})


router.post('/startdatacollecting', requireLogin, (req, res) => {
    const { idCluster, idContainer, domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })



    let custom_id = req.user._id.toString() + idCluster + idContainer + "0"


    hashed_id = crypto.createHash('md5').update(custom_id).digest('hex').toString()
    let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
        let validator = true


        console.log("running a task new for user " + req.user._id.toString() + "and cluster " + idCluster);

        container.inspect(function (err, data) {
            if (StatusChangeAlert == true) {
                if (data.State['Status'] != 'running') {
                    validator = false
                    const alertNotification = new AlertNotification({
                        ownedBy: req.user,
                        idCluster: idCluster,
                        ClusterName: nickname,
                        idContainer: idContainer,
                        ContainerName: ContainerName,
                        TypeOfNotification: "Container Status Changed (Stopped)",

                        Message: 'Container stopped'
                    })
                    alertNotification.save().then(result => {
                        res.json({ alertNotification: result })
                    })
                        .catch(err => {

                        })

                }
                else {
                    validator = true
                }
            }
        })

        if (validator == true) {
            container.stats({ stream: false }, function (err, data) {
                // console.log(data)


                if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(MemPercAlert)) {
                    const alertNotification = new AlertNotification({
                        ownedBy: req.user,
                        idCluster: idCluster,
                        ClusterName: nickname,
                        idContainer: idContainer,
                        ContainerName: ContainerName,
                        TypeOfNotification: "Memory Usage % ALERT",
                        ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                        ValueSetByUser: MemPercAlert,
                        Message: 'Memory Usage % threshold exceeded'
                    })
                    alertNotification.save().then(result => {
                        res.json({ alertNotification: result })
                    })
                        .catch(err => {

                        })
                }
                if (parseFloat(data.memory_stats['usage']) / 1000000 >= parseFloat(MemUsedAlert)) {
                    const alertNotification = new AlertNotification({
                        ownedBy: req.user,
                        idCluster: idCluster,
                        ClusterName: nickname,
                        idContainer: idContainer,
                        ContainerName: ContainerName,
                        TypeOfNotification: "Memory Usage ALERT",
                        ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                        ValueSetByUser: MemUsedAlert,
                        Message: 'Memory Usage threshold exceeded'
                    })
                    alertNotification.save().then(result => {
                        res.json({ alertNotification: result })
                    })
                        .catch(err => {

                        })

                }
                if (data.memory_stats.length != undefined) {
                    if ((parseFloat(data.memory_stats.stats['total_cache'] / 1000000)) >= (parseFloat(CacheAlert))) {
                        const alertNotification = new AlertNotification({
                            ownedBy: req.user,
                            idCluster: idCluster,
                            ClusterName: nickname,
                            idContainer: idContainer,
                            ContainerName: ContainerName,
                            TypeOfNotification: "Cache ALERT",
                            ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                            ValueSetByUser: CacheAlert,
                            Message: 'Cache threshold exceeded'
                        })
                        alertNotification.save().then(result => {
                            res.json({ alertNotification: result })
                        })
                            .catch(err => {

                            })

                    }
                }

                let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)

                if (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100)) >= parseFloat(CpuPercAlert)) {
                    const alertNotification = new AlertNotification({
                        ownedBy: req.user,
                        idCluster: idCluster,
                        ClusterName: nickname,
                        idContainer: idContainer,
                        ContainerName: ContainerName,
                        TypeOfNotification: "CPU Usage % ALERT",
                        ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                        ValueSetByUser: CpuPercAlert,
                        Message: 'CPU Percentage threshold exceeded'
                    })
                    alertNotification.save().then(result => {
                        res.json({ alertNotification: result })
                    })
                        .catch(err => {

                        })

                }
                if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(UserModeAlert)) {
                    const alertNotification = new AlertNotification({
                        ownedBy: req.user,
                        idCluster: idCluster,
                        ClusterName: nickname,
                        idContainer: idContainer,
                        ContainerName: ContainerName,
                        TypeOfNotification: "CPU Usage User Mode % ALERT",
                        ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                        ValueSetByUser: UserModeAlert,
                        Message: 'CPU User Mode Percentage threshold exceeded'
                    })
                    alertNotification.save().then(result => {
                        res.json({ alertNotification: result })
                    })
                        .catch(err => {

                        })

                }
                if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(KernelModeAlert)) {
                    const alertNotification = new AlertNotification({
                        ownedBy: req.user,
                        idCluster: idCluster,
                        ClusterName: nickname,
                        idContainer: idContainer,
                        ContainerName: ContainerName,
                        TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                        ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                        ValueSetByUser: KernelModeAlert,
                        Message: 'CPU Kernel Mode Percentage threshold exceeded'
                    })
                    alertNotification.save().then(result => {
                        res.json({ alertNotification: result })
                    })
                        .catch(err => {

                        })

                }
                if (data.networks != undefined) {
                    if (parseFloat(data.networks.eth0['tx_bytes'] / data.networks.eth0['rx_bytes']) >= parseFloat(TxRxRateAlert)) {
                        const alertNotification = new AlertNotification({
                            ownedBy: req.user,
                            idCluster: idCluster,
                            ClusterName: nickname,
                            idContainer: idContainer,
                            ContainerName: ContainerName,
                            TypeOfNotification: "Tx/Rx Rate ALERT",
                            ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                            ValueSetByUser: TxRxRateAlert,
                            Message: 'Tx/Rx Rate threshold exceeded'
                        })
                        alertNotification.save().then(result => {
                            res.json({ alertNotification: result })
                        })
                            .catch(err => {

                            })

                    }
                    if (parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000) >= parseFloat(TxDataAlert)) {
                        const alertNotification = new AlertNotification({
                            ownedBy: req.user,
                            idCluster: idCluster,
                            ClusterName: nickname,
                            idContainer: idContainer,
                            ContainerName: ContainerName,
                            TypeOfNotification: "Network Tx MiB ALERT",
                            ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                            ValueSetByUser: TxDataAlert,
                            Message: 'Tx MiB threshold exceeded'
                        })
                        alertNotification.save().then(result => {
                            res.json({ alertNotification: result })
                        })
                            .catch(err => {

                            })

                    }
                    if (parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000) >= parseFloat(RxDataAlert)) {
                        const alertNotification = new AlertNotification({
                            ownedBy: req.user,
                            idCluster: idCluster,
                            ClusterName: nickname,
                            idContainer: idContainer,
                            ContainerName: ContainerName,
                            TypeOfNotification: "Network Rx MiB ALERT",
                            ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                            ValueSetByUser: RxDataAlert,
                            Message: 'Rx MiB threshold exceeded'
                        })
                        alertNotification.save().then(result => {
                            res.json({ alertNotification: result })
                        })
                            .catch(err => {

                            })

                    }
                    if (PacketDroppedAlert == true) {
                        if (parseFloat(data.networks.eth0['rx_dropped']) != 0) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: nickname,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                TypeOfNotification: "Rx Packet Dropped",
                                ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
                                ValueSetByUser: 0,
                                Message: 'Rx Packet dropped'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (parseFloat(data.networks.eth0['tx_dropped']) != 0) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: nickname,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                TypeOfNotification: "Tx Packet Dropped",
                                ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
                                ValueSetByUser: 0,
                                Message: 'Tx Packet dropped'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                        }
                    }
                    if (PacketErrorAlert == true) {
                        if (parseFloat(data.networks.eth0['rx_errors']) != 0) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: nickname,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                TypeOfNotification: "Rx Packet Error",
                                ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
                                ValueSetByUser: 0,
                                Message: 'Rx Packet Error'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                        }
                        if (parseFloat(data.networks.eth0['tx_errors']) != 0) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                ClusterName: nickname,
                                idContainer: idContainer,
                                ContainerName: ContainerName,
                                TypeOfNotification: "Tx Packet Error",
                                ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
                                ValueSetByUser: 0,
                                Message: 'Tx Packet Error'
                            })
                            alertNotification.save().then(result => {
                                res.json({ alertNotification: result })
                            })
                                .catch(err => {

                                })

                        }
                    }

                }
            });
        }


    });

})




module.exports = router