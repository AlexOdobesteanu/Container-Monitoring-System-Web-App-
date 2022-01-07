const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Container = mongoose.model("Container")
const cpuModel = mongoose.model("cpuModel")
const requireLogin = require('../middleware/requireLogin')
const {SECRET} = require('../keys')
const {IV} = require('../keys')


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
            res.json({containers})
        })
        .catch(err => {
            console.log(err)
        })

})


router.post('/addcontainer', requireLogin, (req, res) => {
    const {host, username, password} = req.body
    if (!host || !username || !password) {
        return res.status(422).json({error: "Please add all the fields"})
    }
    const container = new Container({
        host: host,
        username: username,
        password: encrypt(password),
        ownedBy: req.user
    })
    container.save().then(result => {
        res.json({container: result})
    })
        .catch(err => {
            console.log(err)
        })
})


router.get('/mycontainers', requireLogin, (req, res) => {
    Container.find({ownedBy: req.user._id})
        .populate("ownedBy", "host user")
        .then(mycontainer => {
            res.json({mycontainer})
        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/allcpu', requireLogin, (req, res) => {
    cpuModel.find({forContainer: req.body.forContainer})
        .populate("forContainer", "usePercentage")
        .then(mycpu => {
            res.json({mycpu})
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/info', requireLogin, (req, res) => {
    const id = req.body.idContainer
    console.log(id)
    Container.find({_id: id})
        .populate("_id", "host username password")
        .then(mycontainerInfo => {
            res.json({mycontainerInfo})
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


module.exports = router

