var Docker = require('dockerode')
const e = require('express')
var fs = require('fs')
const { get } = require('http')
require('./models/generaldata')
const mongoose = require('mongoose')
require('./models/cluster')
const Cluster = mongoose.model("Cluster")
require('./models/AlertHistory')
const AlertHistory = mongoose.model("AlertHistory")
require('./models/alertNotification')
const AlertNotification = mongoose.model("AlertNotification")
const GeneralData = mongoose.model("GeneralData")
require('./models/Nodes')
const Nodes = mongoose.model("Nodes")
var crypto = require('crypto')
const schedule = require('node-schedule')


function startAlertTasks(alertsData) {
    if (alertsData.idNode == null) {
        Cluster.find({ ownedBy: alertsData.ownedBy, _id: alertsData.idCluster })
            .populate("ownedBy _id", "domainName nickname")
            .then(mycluster => {


                var mydocker = new Docker({
                    host: mycluster[0].domainName,
                    port: 2376,
                    ca: fs.readFileSync('./configFiles/' + alertsData.ownedBy.toString() + '/' + mycluster[0].nickname + '/' + 'ca.pem'),
                    cert: fs.readFileSync('./configFiles/' + alertsData.ownedBy.toString() + '/' + mycluster[0].nickname + '/' + 'cert.pem'),
                    key: fs.readFileSync('./configFiles/' + alertsData.ownedBy.toString() + '/' + mycluster[0].nickname + '/' + 'key.pem')
                })
                var container = mydocker.getContainer(alertsData.idContainer)
                let custom_id = alertsData.ownedBy.toString() + alertsData.idCluster + alertsData.idContainer + alertsData.idNode
                hashed_id = crypto.createHash('md5').update(custom_id).digest('hex').toString()
                let current_job = schedule.scheduledJobs[hashed_id]
                if (current_job == null) {
                    let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
                        let validator = true

                        console.log("running a task new for user " + alertsData.ownedBy.toString() + "and cluster " + alertsData.idCluster);

                        container.inspect(function (err, data) {
                            if (alertsData.StatusChangeAlert == true) {
                                if (data.State['Status'] != 'running') {
                                    validator = false
                                    const alertNotification = new AlertNotification({
                                        ownedBy: alertsData.ownedBy,
                                        idCluster: alertsData.idCluster,
                                        ClusterName: alertsData.ClusterName,
                                        idContainer: alertsData.idContainer,
                                        ContainerName: alertsData.ContainerName,
                                        NodeId: alertsData.idNode,
                                        NodeName: alertsData.NodeName,
                                        TypeOfNotification: "Container Status Changed (Stopped)",
                                        Message: 'Container stopped'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })
                                    const alertHistory = new AlertHistory({
                                        ownedBy: alertsData.ownedBy,
                                        idCluster: alertsData.idCluster,
                                        ClusterName: alertsData.ClusterName,
                                        idContainer: alertsData.idContainer,
                                        ContainerName: alertsData.ContainerName,
                                        NodeId: alertsData.idNode,
                                        NodeName: alertsData.NodeName,
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

                                if (data != null) {
                                    if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(alertsData.MemPercAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage % ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                            ValueSetByUser: alertsData.MemPercAlert,
                                            Message: 'Memory Usage % threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage % ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                            ValueSetByUser: alertsData.MemPercAlert,
                                            Message: 'Memory Usage % threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })
                                    }
                                    if (parseFloat(data.memory_stats['usage']) / 1000000 >= parseFloat(alertsData.MemUsedAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                            ValueSetByUser: alertsData.MemUsedAlert,
                                            Message: 'Memory Usage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                            ValueSetByUser: alertsData.MemUsedAlert,
                                            Message: 'Memory Usage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (data.memory_stats.length != undefined) {
                                        if ((parseFloat(data.memory_stats.stats['total_cache'] / 1000000)) >= (parseFloat(alertsData.CacheAlert))) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Cache ALERT",
                                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                                ValueSetByUser: alertsData.CacheAlert,
                                                Message: 'Cache threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })


                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Cache ALERT",
                                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                                ValueSetByUser: alertsData.CacheAlert,
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

                                    if (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100)) >= parseFloat(alertsData.CpuPercAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage % ALERT",
                                            ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                            ValueSetByUser: alertsData.CpuPercAlert,
                                            Message: 'CPU Percentage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage % ALERT",
                                            ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                            ValueSetByUser: alertsData.CpuPercAlert,
                                            Message: 'CPU Percentage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(alertsData.UserModeAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage User Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.UserModeAlert,
                                            Message: 'CPU User Mode Percentage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage User Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.UserModeAlert,
                                            Message: 'CPU User Mode Percentage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(alertsData.KernelModeAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.KernelModeAlert,
                                            Message: 'CPU Kernel Mode Percentage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.KernelModeAlert,
                                            Message: 'CPU Kernel Mode Percentage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (data.networks != undefined) {
                                        if (parseFloat(data.networks.eth0['tx_bytes'] / data.networks.eth0['rx_bytes']) >= parseFloat(alertsData.TxRxRateAlert)) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Tx/Rx Rate ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                                ValueSetByUser: alertsData.TxRxRateAlert,
                                                Message: 'Tx/Rx Rate threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })

                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Tx/Rx Rate ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                                ValueSetByUser: alertsData.TxRxRateAlert,
                                                Message: 'Tx/Rx Rate threshold exceeded'
                                            })
                                            alertHistory.save().then(result => {
                                                res.json({ alertHistory: result })
                                            })
                                                .catch(err => {

                                                })

                                        }
                                        if (parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000) >= parseFloat(alertsData.TxDataAlert)) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Tx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.TxDataAlert,
                                                Message: 'Tx MiB threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })

                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Tx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.TxDataAlert,
                                                Message: 'Tx MiB threshold exceeded'
                                            })
                                            alertHistory.save().then(result => {
                                                res.json({ alertHistory: result })
                                            })
                                                .catch(err => {

                                                })

                                        }
                                        if (parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000) >= parseFloat(alertsData.RxDataAlert)) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Rx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.RxDataAlert,
                                                Message: 'Rx MiB threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })

                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Rx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.RxDataAlert,
                                                Message: 'Rx MiB threshold exceeded'
                                            })
                                            alertHistory.save().then(result => {
                                                res.json({ alertHistory: result })
                                            })
                                                .catch(err => {

                                                })

                                        }
                                        if (alertsData.PacketDroppedAlert == true) {
                                            if (parseFloat(data.networks.eth0['rx_dropped']) != 0) {
                                                const alertNotification = new AlertNotification({
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                        if (alertsData.PacketErrorAlert == true) {
                                            if (parseFloat(data.networks.eth0['rx_errors']) != 0) {
                                                const alertNotification = new AlertNotification({
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                        }


                    });

                }




            })
            .catch(err => {
                console.log(err)
            })

    }
    else {

        Nodes.find({ ownedBy: alertsData.ownedBy, _id: alertsData.idNode, idCluster: alertsData.idCluster })
            .populate("ownedBy _id idCluster", "domainName nickname NodeID")
            .then(mycluster => {
                console.log(mycluster)

                if (mycluster != null) {
                    var mydocker = new Docker({
                        host: mycluster[0].domainName,
                        port: 2376,
                        ca: fs.readFileSync('./configFiles/' + alertsData.ownedBy.toString() + '/' + mycluster[0].nickname + '/' + 'ca.pem'),
                        cert: fs.readFileSync('./configFiles/' + alertsData.ownedBy.toString() + '/' + mycluster[0].nickname + '/' + 'cert.pem'),
                        key: fs.readFileSync('./configFiles/' + alertsData.ownedBy.toString() + '/' + mycluster[0].nickname + '/' + 'key.pem')
                    })
                    var container = mydocker.getContainer(alertsData.idContainer)
                    let custom_id = alertsData.ownedBy.toString() + alertsData.idCluster + alertsData.idContainer + alertsData.idNode
                    hashed_id = crypto.createHash('md5').update(custom_id).digest('hex').toString()
                    let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
                        let validator = true

                        console.log("running a task new for user " + alertsData.ownedBy.toString() + "and node ");

                        container.inspect(function (err, data) {
                            if (alertsData.StatusChangeAlert == true) {
                                if (data.State['Status'] != 'running') {
                                    validator = false
                                    const alertNotification = new AlertNotification({
                                        ownedBy: alertsData.ownedBy,
                                        idCluster: alertsData.idCluster,
                                        ClusterName: alertsData.ClusterName,
                                        idContainer: alertsData.idContainer,
                                        ContainerName: alertsData.ContainerName,
                                        NodeId: alertsData.idNode,
                                        NodeName: alertsData.NodeName,
                                        TypeOfNotification: "Container Status Changed (Stopped)",
                                        Message: 'Container stopped'
                                    })
                                    alertNotification.save().then(result => {
                                        res.json({ alertNotification: result })
                                    })
                                        .catch(err => {

                                        })
                                    const alertHistory = new AlertHistory({
                                        ownedBy: alertsData.ownedBy,
                                        idCluster: alertsData.idCluster,
                                        ClusterName: alertsData.ClusterName,
                                        idContainer: alertsData.idContainer,
                                        ContainerName: alertsData.ContainerName,
                                        NodeId: alertsData.idNode,
                                        NodeName: alertsData.NodeName,
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

                                if (data != null) {
                                    if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(alertsData.MemPercAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage % ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                            ValueSetByUser: alertsData.MemPercAlert,
                                            Message: 'Memory Usage % threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage % ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100).toString(),
                                            ValueSetByUser: alertsData.MemPercAlert,
                                            Message: 'Memory Usage % threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })
                                    }
                                    if (parseFloat(data.memory_stats['usage']) / 1000000 >= parseFloat(alertsData.MemUsedAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                            ValueSetByUser: alertsData.MemUsedAlert,
                                            Message: 'Memory Usage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "Memory Usage ALERT",
                                            ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                            ValueSetByUser: alertsData.MemUsedAlert,
                                            Message: 'Memory Usage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (data.memory_stats.length != undefined) {
                                        if ((parseFloat(data.memory_stats.stats['total_cache'] / 1000000)) >= (parseFloat(alertsData.CacheAlert))) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Cache ALERT",
                                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                                ValueSetByUser: alertsData.CacheAlert,
                                                Message: 'Cache threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })


                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Cache ALERT",
                                                ValueOver: ((parseFloat(data.memory_stats['usage']) / 1000000)).toString(),
                                                ValueSetByUser: alertsData.CacheAlert,
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

                                    if (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100)) >= parseFloat(alertsData.CpuPercAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage % ALERT",
                                            ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                            ValueSetByUser: alertsData.CpuPercAlert,
                                            Message: 'CPU Percentage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage % ALERT",
                                            ValueOver: (parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))).toString(),
                                            ValueSetByUser: alertsData.CpuPercAlert,
                                            Message: 'CPU Percentage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(alertsData.UserModeAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage User Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.UserModeAlert,
                                            Message: 'CPU User Mode Percentage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage User Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.UserModeAlert,
                                            Message: 'CPU User Mode Percentage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100) >= parseFloat(alertsData.KernelModeAlert)) {
                                        const alertNotification = new AlertNotification({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.KernelModeAlert,
                                            Message: 'CPU Kernel Mode Percentage threshold exceeded'
                                        })
                                        alertNotification.save().then(result => {
                                            res.json({ alertNotification: result })
                                        })
                                            .catch(err => {

                                            })

                                        const alertHistory = new AlertHistory({
                                            ownedBy: alertsData.ownedBy,
                                            idCluster: alertsData.idCluster,
                                            ClusterName: alertsData.ClusterName,
                                            idContainer: alertsData.idContainer,
                                            ContainerName: alertsData.ContainerName,
                                            NodeId: alertsData.idNode,
                                            NodeName: alertsData.NodeName,
                                            TypeOfNotification: "CPU Usage Kernel Mode % ALERT",
                                            ValueOver: (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)).toString(),
                                            ValueSetByUser: alertsData.KernelModeAlert,
                                            Message: 'CPU Kernel Mode Percentage threshold exceeded'
                                        })
                                        alertHistory.save().then(result => {
                                            res.json({ alertHistory: result })
                                        })
                                            .catch(err => {

                                            })

                                    }
                                    if (data.networks != undefined) {
                                        if (parseFloat(data.networks.eth0['tx_bytes'] / data.networks.eth0['rx_bytes']) >= parseFloat(alertsData.TxRxRateAlert)) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Tx/Rx Rate ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                                ValueSetByUser: alertsData.TxRxRateAlert,
                                                Message: 'Tx/Rx Rate threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })

                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Tx/Rx Rate ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes'])).toString(),
                                                ValueSetByUser: alertsData.TxRxRateAlert,
                                                Message: 'Tx/Rx Rate threshold exceeded'
                                            })
                                            alertHistory.save().then(result => {
                                                res.json({ alertHistory: result })
                                            })
                                                .catch(err => {

                                                })

                                        }
                                        if (parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000) >= parseFloat(alertsData.TxDataAlert)) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Tx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.TxDataAlert,
                                                Message: 'Tx MiB threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })

                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Tx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.TxDataAlert,
                                                Message: 'Tx MiB threshold exceeded'
                                            })
                                            alertHistory.save().then(result => {
                                                res.json({ alertHistory: result })
                                            })
                                                .catch(err => {

                                                })

                                        }
                                        if (parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000) >= parseFloat(alertsData.RxDataAlert)) {
                                            const alertNotification = new AlertNotification({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Rx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.RxDataAlert,
                                                Message: 'Rx MiB threshold exceeded'
                                            })
                                            alertNotification.save().then(result => {
                                                res.json({ alertNotification: result })
                                            })
                                                .catch(err => {

                                                })

                                            const alertHistory = new AlertHistory({
                                                ownedBy: alertsData.ownedBy,
                                                idCluster: alertsData.idCluster,
                                                ClusterName: alertsData.ClusterName,
                                                idContainer: alertsData.idContainer,
                                                ContainerName: alertsData.ContainerName,
                                                NodeId: alertsData.idNode,
                                                NodeName: alertsData.NodeName,
                                                TypeOfNotification: "Network Rx MiB ALERT",
                                                ValueOver: parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000).toString(),
                                                ValueSetByUser: alertsData.RxDataAlert,
                                                Message: 'Rx MiB threshold exceeded'
                                            })
                                            alertHistory.save().then(result => {
                                                res.json({ alertHistory: result })
                                            })
                                                .catch(err => {

                                                })

                                        }
                                        if (alertsData.PacketDroppedAlert == true) {
                                            if (parseFloat(data.networks.eth0['rx_dropped']) != 0) {
                                                const alertNotification = new AlertNotification({
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                        if (alertsData.PacketErrorAlert == true) {
                                            if (parseFloat(data.networks.eth0['rx_errors']) != 0) {
                                                const alertNotification = new AlertNotification({
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                                                    ownedBy: alertsData.ownedBy,
                                                    idCluster: alertsData.idCluster,
                                                    ClusterName: alertsData.ClusterName,
                                                    idContainer: alertsData.idContainer,
                                                    ContainerName: alertsData.ContainerName,
                                                    NodeId: alertsData.idNode,
                                                    NodeName: alertsData.NodeName,
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
                        }


                    });

                }






            })
            .catch(err => {
                console.log(err)
            })

    }

}

function monitoringCont(clusterData) {
    let idNode = ""
    let NodeName = ""

    if (clusterData.idNode == undefined) {
        idNode = ""
    }

    if (clusterData.nickname == undefined) {
        NodeName = ""
    }

    const id_in_db = clusterData._id.toString()
    const domainName = clusterData.domainName.toString()
    const nickname = clusterData.nickname.toString()
    const ownedBy = clusterData.ownedBy.toString()

    if (fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'ca.pem') && fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'cert.pem') && fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'key.pem')) {
        var mydocker = new Docker({
            host: domainName,
            port: 2376,
            ca: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'ca.pem'),
            cert: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'cert.pem'),
            key: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'key.pem')
        })

        mydocker.listContainers({ all: true }, function (err, containers) {
            if (containers != null) {
                console.log("PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                for (i = 0; i < containers.length; i++) {
                    const idContainer = containers[i].Id.toString()
                    var container = mydocker.getContainer(idContainer)
                    let validator = true
                    let status = ""
                    let name = ""

                    container.inspect(function (err, data) {
                        if (data == null) {
                            name = ""
                            validator = true
                            status = "exited"
                        }
                        else {
                            name = data.Name
                            if (data.State['Status'] != 'running') {
                                validator = true
                                status = "exited"
                            }
                            else {
                                validator = false
                                status = "running"
                            }
                        }




                    })

                    if (validator == true) {
                        container.stats({ stream: false }, function (err, data) {
                            // console.log(data)


                            let memPercentage = (parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100
                            let memUsed = (parseFloat(data.memory_stats['usage'])) / 1000000
                            let cache = 0


                            if (data.memory_stats.stats != undefined) {
                                cache = parseFloat(data.memory_stats.stats['total_cache'] / 1000000)
                                console.log(cache)
                            }

                            let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                            let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)
                            let cpuPercentage = parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))
                            let cpuUserPerc = parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)
                            let cpuKernelPerc = (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100))
                            let TxRxRate = 0
                            let txMIB = 0
                            let rxMIB = 0
                            let rxDropped = 0
                            let txDropped = 0
                            let rxErrors = 0
                            let txErrors = 0

                            if (data.networks != undefined) {
                                TxRxRate = parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes']))
                                txMIB = parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000)
                                rxMIB = parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000)
                                rxDropped = parseFloat(data.networks.eth0['rx_dropped'])
                                txDropped = parseFloat(data.networks.eth0['tx_dropped'])
                                rxErrors = parseFloat(data.networks.eth0['rx_errors'])
                                txErrors = parseFloat(data.networks.eth0['tx_errors'])
                            }
                            let found = true
                            GeneralData.findOne({ ownedBy: ownedBy, idCluster: id_in_db, idContainer: idContainer, idNode: idNode })
                                .populate("ownedBy idCluster idContainer idNode", "NodeName ContainerName ClusterNickname MemPerc MemUsed Cache CpuPerc UserMode KernelMode TxRxRate TxData RxData StatusChange PacketDropped PacketError")
                                .then(mygeneral => {
                                    if (mygeneral == null) {
                                        found = false
                                        const generaldata = new GeneralData({
                                            ownedBy: ownedBy,
                                            idCluster: id_in_db,
                                            ClusterNickname: nickname,
                                            idContainer: idContainer,
                                            ContainerName: name.toString(),
                                            idNode: idNode,
                                            NodeName: NodeName,
                                            MemPerc: memPercentage.toString().split(-3),
                                            MemUsed: memUsed.toString().split(-3),
                                            Cache: cache.toString().split(-3),
                                            CpuPerc: cpuPercentage.toString().split(-3),
                                            UserMode: cpuUserPerc.toString().split(-3),
                                            KernelMode: cpuKernelPerc.toString().split(-3),
                                            TxRxRate: TxRxRate.toString().split(-3),
                                            TxData: txMIB.toString(),
                                            RxData: rxMIB.toString().split(-3),
                                            StatusChange: status.toString(),
                                            TxDropped: txDropped.toString(),
                                            RxDropped: rxDropped.toString(),
                                            TxError: txErrors.toString(),
                                            RxError: rxErrors.toString()
                                        })
                                        generaldata.save().then(result => {

                                        })
                                    }
                                })

                            if (found == true) {
                                GeneralData.updateOne({ ownedBy: ownedBy, idCluster: id_in_db, idContainer: idContainer, idNode: idNode },
                                    {
                                        $push: {
                                            MemPerc: memPercentage.toString().split(-3),
                                            MemUsed: memUsed.toString().split(-3),
                                            Cache: cache.toString().split(-3),
                                            CpuPerc: cpuPercentage.toString().split(-3),
                                            UserMode: cpuUserPerc.toString().split(-3),
                                            KernelMode: cpuKernelPerc.toString().split(-3),
                                            TxRxRate: TxRxRate.toString().split(-3),
                                            TxData: txMIB.toString(),
                                            RxData: rxMIB.toString().split(-3),
                                            StatusChange: status.toString(),
                                            TxDropped: txDropped.toString(),
                                            RxDropped: rxDropped.toString(),
                                            TxError: txErrors.toString(),
                                            RxError: rxErrors.toString(),
                                            DateOfNotification: Date.now()
                                        }
                                    },
                                    function (error, success) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log(success);
                                        }
                                    }
                                )
                            }
                        }
                        );
                    }

                }
            }


        })

    }



}


function monitoringNode(clusterData) {
    let idNode = ""
    let NodeName = ""


    const idCluster = clusterData.idCluster.toString()
    const id_in_db = clusterData._id.toString()
    const domainName = clusterData.domainName.toString()
    const nickname = clusterData.nickname.toString()
    const ownedBy = clusterData.ownedBy.toString()

    if (fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'ca.pem') && fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'cert.pem') && fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'key.pem')) {
        var mydocker = new Docker({
            host: domainName,
            port: 2376,
            ca: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'ca.pem'),
            cert: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'cert.pem'),
            key: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'key.pem')
        })

        mydocker.listContainers({ all: true }, function (err, containers) {
            if (containers != null) {
                console.log("PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                for (i = 0; i < containers.length; i++) {
                    const idContainer = containers[i].Id.toString()
                    var container = mydocker.getContainer(idContainer)
                    let validator = true
                    let status = ""
                    let name = ""

                    container.inspect(function (err, data) {
                        name = data.Name

                        if (data.State['Status'] != 'running') {
                            validator = true
                            status = "exited"
                        }
                        else {
                            validator = false
                            status = "running"
                        }

                    })

                    if (validator == true) {
                        container.stats({ stream: false }, function (err, data) {
                            // console.log(data)


                            let memPercentage = (parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100
                            let memUsed = (parseFloat(data.memory_stats['usage'])) / 1000000
                            let cache = 0


                            if (data.memory_stats.stats != undefined) {
                                cache = parseFloat(data.memory_stats.stats['total_cache'] / 1000000)
                                console.log(cache)
                            }

                            let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                            let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)
                            let cpuPercentage = parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))
                            let cpuUserPerc = parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)
                            let cpuKernelPerc = (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100))
                            let TxRxRate = 0
                            let txMIB = 0
                            let rxMIB = 0
                            let rxDropped = 0
                            let txDropped = 0
                            let rxErrors = 0
                            let txErrors = 0

                            if (data.networks != undefined) {
                                TxRxRate = parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes']))
                                txMIB = parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000)
                                rxMIB = parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000)
                                rxDropped = parseFloat(data.networks.eth0['rx_dropped'])
                                txDropped = parseFloat(data.networks.eth0['tx_dropped'])
                                rxErrors = parseFloat(data.networks.eth0['rx_errors'])
                                txErrors = parseFloat(data.networks.eth0['tx_errors'])
                            }
                            let found = true
                            GeneralData.findOne({ ownedBy: ownedBy, idCluster: idCluster, idContainer: idContainer, idNode: id_in_db })
                                .populate("ownedBy idCluster idContainer idNode", "NodeName ContainerName ClusterNickname MemPerc MemUsed Cache CpuPerc UserMode KernelMode TxRxRate TxData RxData StatusChange PacketDropped PacketError")
                                .then(mygeneral => {
                                    if (mygeneral == null) {
                                        found = false
                                        const generaldata = new GeneralData({
                                            ownedBy: ownedBy,
                                            idCluster: idCluster,
                                            ClusterNickname: nickname,
                                            idContainer: idContainer,
                                            ContainerName: name.toString(),
                                            idNode: id_in_db,
                                            NodeName: NodeName,
                                            MemPerc: memPercentage.toString().split(-3),
                                            MemUsed: memUsed.toString().split(-3),
                                            Cache: cache.toString().split(-3),
                                            CpuPerc: cpuPercentage.toString().split(-3),
                                            UserMode: cpuUserPerc.toString().split(-3),
                                            KernelMode: cpuKernelPerc.toString().split(-3),
                                            TxRxRate: TxRxRate.toString().split(-3),
                                            TxData: txMIB.toString(),
                                            RxData: rxMIB.toString().split(-3),
                                            StatusChange: status.toString(),
                                            TxDropped: txDropped.toString(),
                                            RxDropped: rxDropped.toString(),
                                            TxError: txErrors.toString(),
                                            RxError: rxErrors.toString()
                                        })
                                        generaldata.save().then(result => {

                                        })
                                    }
                                })

                            if (found == true) {
                                GeneralData.updateOne({ ownedBy: ownedBy, idCluster: idCluster, idContainer: idContainer, idNode: id_in_db },
                                    {
                                        $push: {
                                            MemPerc: memPercentage.toString().split(-3),
                                            MemUsed: memUsed.toString().split(-3),
                                            Cache: cache.toString().split(-3),
                                            CpuPerc: cpuPercentage.toString().split(-3),
                                            UserMode: cpuUserPerc.toString().split(-3),
                                            KernelMode: cpuKernelPerc.toString().split(-3),
                                            TxRxRate: TxRxRate.toString().split(-3),
                                            TxData: txMIB.toString(),
                                            RxData: rxMIB.toString().split(-3),
                                            StatusChange: status.toString(),
                                            TxDropped: txDropped.toString(),
                                            RxDropped: rxDropped.toString(),
                                            TxError: txErrors.toString(),
                                            RxError: rxErrors.toString(),
                                            DateOfNotification: Date.now()
                                        }
                                    },
                                    function (error, success) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log(success);
                                        }
                                    }
                                )
                            }
                        }
                        );
                    }

                }

            }


        })

    }
}




module.exports = { monitoringCont, monitoringNode, startAlertTasks }