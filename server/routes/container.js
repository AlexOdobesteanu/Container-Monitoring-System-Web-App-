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
const AlertNotification = mongoose.model("AlertNotification")
const requireLogin = require('../middleware/requireLogin')
const { SECRET } = require('../keys')
const { IV } = require('../keys')
const e = require('express')
const bcrypt = require('bcryptjs')
const path = require('path');
const { alertClasses } = require('@mui/material');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = SECRET,
    iv = IV;

function encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipheriv(algorithm, password, iv)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

router.get('/allcontainers', requireLogin, (req, res) => {
    Container.find()
        .populate("ownedBy", "_id name")
        .then(containers => {
            res.json({ containers })
        })
        .catch(err => {
            console.log(err)
        })

})


router.post('/addcontainer', requireLogin, (req, res) => {
    const { host, username, password } = req.body
    if (!host || !username || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    const container = new Container({
        host: host,
        username: username,
        password: encrypt(password),
        ownedBy: req.user
    })
    container.save().then(result => {
        res.json({ container: result })
    })
        .catch(err => {
            console.log(err)
        })
})

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

router.post('/containersinfo', requireLogin, (req, res) => {
    const { domainName, nickname } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    mydocker.listContainers({ all: true }, function (err, containers) {
        res.json({ containers })
    })
})

router.post('/automonitor', requireLogin, (req, res) => {
    const { domainName, nickname, idContainer } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })

    let arr = []
    var container = mydocker.getContainer(idContainer)
    setInterval(function () {
        container.stats({ stream: false }, function (err, data) {
            console.log(data)
        });
    }, 1000);

})


router.post('/containersfullinfo', requireLogin, (req, res) => {
    const { domainName, nickname, idContainer } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)
    container.inspect(function (err, data) {
        res.json({ data })
    })
})


router.post('/containersstats', requireLogin, (req, res) => {
    const { domainName, nickname, idContainer } = req.body
    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)
    container.stats({ stream: false }, function (err, data) {
        res.json({ data })
    });
})


router.get('/mycontainers', requireLogin, (req, res) => {
    Container.find({ ownedBy: req.user._id })
        .populate("ownedBy", "host user")
        .then(mycontainer => {
            res.json({ mycontainer })
        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/allcpu', requireLogin, (req, res) => {
    cpuModel.find({ forContainer: req.body.forContainer })
        .populate("forContainer", "usePercentage")
        .then(mycpu => {
            res.json({ mycpu })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/info', requireLogin, (req, res) => {
    const id = req.body.idContainer
    console.log(id)
    Container.find({ _id: id })
        .populate("_id", "host username password")
        .then(mycontainerInfo => {
            res.json({ mycontainerInfo })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post("/cpu", (req, res) => {
    const forContainer = req.body.forContainer
    const username = req.body.username;
    const password = decrypt(req.body.password);
    const host = req.body.host;
    const spawn = require("child_process").spawn;

    const pythonProcess = spawn('python', ['./script.py', host.toString(), "" + username.toString(), "" + decrypt(password).toString()]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString())
        const cpuM = new cpuModel({
            forContainer: forContainer,
            usePercentage: data.toString()
        })
        cpuM.save().then(cpuM => {
            res.json(data.toString())
        })
            .catch(err => {
                console.log(err)
            })

    });

    // pythonProcess.stderr.on('data', data => {
    //     console.error('stderr:${data}');
    // })
    //
    // pythonProcess.on('exit', (code) => {
    //     console.log('child process exited with code ${code}')
    // })


})

router.delete("/deletecontainer/:containerId", requireLogin, (req, res) => {
    console.log(req.params.containerId)
    Container.findOne({ _id: req.params.containerId })
        .populate("_id", "_id")
        .exec((err, container) => {
            if (err || !container) {
                return res.status(422).json({ error: err })
            }
            else {
                container.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })

})

// router.post("/cpu", (req, res) => {
//     const forContainer = req.body.forContainer
//     const username = req.body.username;
//     const password = decrypt(req.body.password);
//     const host = req.body.host;
//     const spawn = require("child_process").spawn;

//     const pythonProcess = spawn('python', ['./script.py', host.toString(), "" + username.toString(), "" + decrypt(password).toString()]);
//     pythonProcess.stdout.on('data', (data) => {
//         console.log(data.toString())
//         const cpuM = new cpuModel({
//             forContainer: forContainer,
//             usePercentage: data.toString()
//         })
//         cpuM.save().then(cpuM => {
//             res.json(data.toString())
//         })
//             .catch(err => {
//                 console.log(err)
//             })

//     });

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
            'remote-api': {
                image: 'kekru/docker-remote-api-tls:v0.4.0',
                ports: [
                    '2376:443'
                ],
                environment: [
                    'CREATE_CERTS_WITH_PW=' + certsPass,
                    'CERT_EXPIRATION_DAYS=' + certDays,
                    'CA_EXPIRATION_DAYS=' + caDays,
                    'CERT_HOSTNAME=' + hostname
                ],
                volumes: [
                    '/data/certs',
                    '/var/run/docker.sock:/var/run/docker.sock:ro'
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


router.post("/AlertConfigure", requireLogin, (req, res) => {
    console.log('aaa')
    let found = true
    const { idCluster, idContainer, MemPercAlert, MemUsedAlert, CacheAlert, CpuPercAlert
        , UserModeAlert, KernelModeAlert, TxRxRateAlert, TxDataAlert, RxDataAlert
        , StatusChangeAlert, PacketDroppedAlert, PacketErrorAlert, domainName, nickname } = req.body

    var mydocker = new Docker({
        host: domainName,
        port: 2376,
        ca: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'ca.pem'),
        cert: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'cert.pem'),
        key: fs.readFileSync('./configFiles/' + req.user._id.toString() + '/' + nickname + '/' + 'key.pem')
    })
    var container = mydocker.getContainer(idContainer)


    Alert.findOne({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer })
        .populate("ownedBy idCluster idContainer", "MemPercAlert MemUsedAlert CacheAlert CpuPercAlert UserModeAlert KernelModeAlert TxRxRateAlert TxDataAlert RxDataAlert StatusChangeAlert PacketDroppedAlert PacketErrorAlert")
        .then(myalert => {
            if (myalert == null) {
                found = false
                const alert = new Alert({
                    ownedBy: req.user,
                    idCluster: idCluster,
                    idContainer: idContainer,
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

                let custom_id = req.user._id.toString() + idCluster + idContainer

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
                                    idContainer: idContainer,
                                    TypeOfNotification: "Container Status Changed (Stopped)",

                                    Message: 'Container ' + idContainer + ' stopped'
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                        idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                        idContainer: idContainer,
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
                                        idContainer: idContainer,
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
                                        idContainer: idContainer,
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
                                            idContainer: idContainer,
                                            TypeOfNotification: "Rx Packet Dropped",
                                            ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
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
                                            idContainer: idContainer,
                                            TypeOfNotification: "Tx Packet Dropped",
                                            ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
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
                                            idContainer: idContainer,
                                            TypeOfNotification: "Rx Packet Error",
                                            ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
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
                                            idContainer: idContainer,
                                            TypeOfNotification: "Tx Packet Error",
                                            ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
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

            }
        })
        .catch(err => {
            console.log(err)
        })
    if (found == true) {
        Alert.findOneAndUpdate({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer },
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
        let custom_id = req.user._id.toString() + idCluster + idContainer
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
                                idContainer: idContainer,
                                TypeOfNotification: "Container Status Changed (Stopped)",
                                Message: 'Container ' + idContainer + ' stopped'
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

                if (validator != false) {
                    container.stats({ stream: false }, function (err, data) {
                        // console.log(data)


                        if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(MemPercAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Rx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Tx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Rx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Tx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
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

            })
        }
        else {
            current_job.cancel()
            let job = schedule.scheduleJob(hashed_id, "*/4 * * * * *", function () {
                let validator = true
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
                                    idContainer: idContainer,
                                    TypeOfNotification: "Container Status Changed (Stopped)",

                                    Message: 'Container ' + idContainer + ' stopped'
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
                        if ((parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100 >= parseFloat(MemPercAlert)) {
                            const alertNotification = new AlertNotification({
                                ownedBy: req.user,
                                idCluster: idCluster,
                                idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                    idContainer: idContainer,
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Rx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['rx_dropped']).toString(),
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Tx Packet Dropped",
                                        ValueOver: parseFloat(data.networks.eth0['tx_dropped']).toString(),
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Rx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['rx_errors']).toString(),
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
                                        idContainer: idContainer,
                                        TypeOfNotification: "Tx Packet Error",
                                        ValueOver: parseFloat(data.networks.eth0['tx_errors']).toString(),
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

                    }

                });

            });
        }
    }

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

router.post('/AlertsNotifications', requireLogin, (req, res) => {
    AlertNotification.find({ ownedBy: req.user._id })
        .populate("ownedBy", "_id idCluster idContainer TypeOfNotification ValueOver ValueSetByUser Message DateOfNotification")
        .then(myalertnotifications => {
            res.json({ myalertnotifications })
        })
        .catch(err => {
            console.log(err)
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

router.delete('/AlertsNotificationsDelete', requireLogin, (req, res) => {
    const { id } = req.body
    console.log(id)
    // AlertNotification.deleteOne({ _id: id }, function (err) {
    //     if (err) {
    //         return res.status(422).json({ error: "Delete failed.Try Again Later" })
    //     }
    //     else {
    //         return res.status(201).json({ succes: "Deleted Successfully" })
    //     }
    // })

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

    // Container.findOne({ _id: req.params.containerId })
    //     .populate("_id", "_id")
    //     .exec((err, container) => {
    //         if (err || !container) {
    //             return res.status(422).json({ error: err })
    //         }
    //         else {
    //             container.remove()
    //                 .then(result => {
    //                     res.json(result)
    //                 }).catch(err => {
    //                     console.log(err)
    //                 })
    //         }
    //     })

})

router.delete('/AlertsNotificationsDeleteAll', requireLogin, (req, res) => {
    // AlertNotification.deleteOne({ _id: id }, function (err) {
    //     if (err) {
    //         return res.status(422).json({ error: "Delete failed.Try Again Later" })
    //     }
    //     else {
    //         return res.status(201).json({ succes: "Deleted Successfully" })
    //     }
    // })

    AlertNotification.deleteMany({}, function (err) {
        if (err) {
            return res.status(422).json({ error: "Delete failed.Try Again Later" })
        }
        else {
            return res.status(201).json({ succes: "Deleted All Successfully" })
        }
    })

})

router.post('/androidCharts', (req, res) => {
    console.log('aaa')
    var mydocker = new Docker({
        host: 'https://remote-api.127-0-0-1.nip.io',
        port: 2376,
        ca: fs.readFileSync('./configFiles/61d55a7468584592c1e39aef/alex/ca.pem'),
        cert: fs.readFileSync('./configFiles/61d55a7468584592c1e39aef/alex/cert.pem'),
        key: fs.readFileSync('./configFiles/61d55a7468584592c1e39aef/alex/key.pem')
    })

    var container = mydocker.getContainer('54b0ff09be5c')
    container.stats({ stream: false }, function (err, data) {
        res.json([data])
    });

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
    container.start((err, data) => {
        if (err) {
            return res.status(422).json({ error: "Container " + idContainer + " couldn't start.Try again !" })
        }
        else {
            return res.status(422).json({ succes: "Container " + idContainer + " started !" })
        }
    })

})


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

module.exports = router

