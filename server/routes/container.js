const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const yaml = require('js-yaml');
const multer = require('multer')
var async = require('async')
var fs = require('fs')
var Docker = require('dockerode')
const Container = mongoose.model("Container")
const cpuModel = mongoose.model("cpuModel")
const Cluster = mongoose.model("Cluster")
const requireLogin = require('../middleware/requireLogin')
const { SECRET } = require('../keys')
const { IV } = require('../keys')
const e = require('express')
const bcrypt = require('bcryptjs')
const path = require('path')

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


module.exports = router

