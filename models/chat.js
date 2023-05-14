const mongoose = require('mongoose');


// const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
    message:{
        type:String
    },
    sender:{
        type:String
    }
}, {timestamps:true})
const Chat = mongoose.model("Chat",chatSchema);

module.exports = Chat;
