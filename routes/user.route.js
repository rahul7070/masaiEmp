const express = require("express");
const { UserModel } = require("../model/user.model");
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const BlackModel = require("../model/blacklist.model");

userRouter.post("/register", async (req, res) => {
    // console.log(req.body)

    const { email, password } = req.body
    try {
        isUserPresent = await UserModel.findOne({ email })
        if (isUserPresent) {
            return res.send({ "msg": "Login Directly" })
        }
        bcrypt.hash(password, 7, async (err, hash) => {
            const user = new UserModel({ email, password: hash })
            await user.save()
            res.status(201).send({ "msg": "Registration Succesfull" })
        });
    } catch (error) {
        res.status(401).send({ "msg": "Some error occourd while  Registration" })
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) 
        {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let accesstoken = jwt.sign({ "userID": user._id }, 'accesstoken', { expiresIn: "7d" });
                    res.status(201).send({ "msg": "login success", "token": accesstoken })
                } else {
                    res.status(401).send({ "msg": "Invalid Credentials" })
                }
            });
        } 
        else{
            res.status(401).send({ "msg": "Invalid Credentials" })

        }
    } catch (error) {
        res.status(401).send({ "msg": "error occourd while login " })

    }
})

userRouter.post("/logout", async (req, res) => {
    try {
        const foundToken = req.headers?.authorization
        const newBlackList = new BlackModel({ token: foundToken })
        await newBlackList.save()
        res.status(201).send({ "msg": "Logout SuccesFully" })
    } catch (error) {
        res.status(401).send({ "msg": error.message })
    }
})

userRouter.get("/blacklist", async (req, res) => {
    try {
        const token = req.headers?.authorization
        const black = await BlackModel.findOne({ token })
        if (black) {
            res.send(black)
        } else {
            res.send({ "msg": "Login Again !!You Are New User" })
        }
    } catch (error) {
        res.status(401).send({ "msg": error.message })

    }
})

module.exports = {userRouter}