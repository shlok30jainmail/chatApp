const express = require("express");
const connect = require("../models/dbconnection");
const Chat = require("../models/chat");

const router = express();

router.route("/").get((req,res,next)=>{
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connect.then(db=>{
        Chat.find({}).then(chat =>{
            res.json(chat);
        })
    })
})

module.exports = router;