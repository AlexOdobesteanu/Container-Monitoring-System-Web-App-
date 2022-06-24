const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var fs = require('fs')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')


router.get("/", (req, res) => {
    res.send("hello")
})

//----------------------------

router.post("/signup", (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "Login successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })


        })

})

//---------------------------------------------

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                res.status(422).json({ error: "Invalid email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: "successfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email } = savedUser
                        res.json({ token: token, user: { _id, name, email } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })

})


router.post("/changepass", requireLogin, (req, res) => {
    const { email, password, passwordNew } = req.body
    if (!password || !passwordNew) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    User.findOne({ email: email })
        .then(savedUser => {
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        bcrypt.hash(passwordNew, 12)
                            .then(hashedpassword => {
                                User.findOneAndUpdate({ _id: savedUser._id },
                                    {
                                        $set: {
                                            password: hashedpassword
                                        }
                                    }
                                )
                                    .then(myuser => {
                                        res.json({ message: "Changed password successfully" })

                                    })
                                    .catch(err => {
                                        return res.status(422).json({ error: "Error" })
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        // res.json({ message: "successfully signed in" })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })


})
module.exports = router