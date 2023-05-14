const express = require("express");
const app = express();
const http = require("http").createServer(app);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch');
mongoose.connect("mongodb://localhost:27017/ChatAPP");
const connect = require("./models/dbconnection")

const Chat = require("./models/chat")

//
const chatRouter = require("./route/chatRoutes");
// bodyparsee middleware
app.use(bodyParser.json());
// routes
app.use("/chats",chatRouter);




const PORT = process.env.PORT || 4000


http.listen(PORT,()=>{
    console.log(`server is running port ${PORT}`);
});


app.use(express.static(__dirname +'/public'))

app.get("/",(req,resp)=>{
    resp.sendFile(__dirname +'/index.html');
})


// Socket

const io = require('socket.io')(http)// server name at where you use it
var users = {};

io.on('connection',(socket)=>{
    console.log("connected....");
    socket.on('message',(msg)=>{
        // console.log(msg.user);
        // making
        socket.broadcast.emit('message', msg);
       

        // save chat to the database

    connect.then(db =>{
        console.log("connected correctly to the server");
        let chatMessage = new Chat({
            message:msg.message,
            sender:msg.user
        });
        chatMessage.save();
    });


    });

     
    // making  joining 
    socket.on('new-user-joined',(name)=>{
        users[socket.id]= name;
                console.log(users);

        socket.broadcast.emit('user-connected',name);

        // for user name list
        io.emit('user-list',users);
    })
    
        // console.log(users);



     // making disconnecting
     socket.on('disconnect',()=>{
        // console.log(msg);
        socket.broadcast.emit('user-disconnected',user = users[socket.id]);
        delete users[socket.id];
         // for user name list
         io.emit('user-list',users);
    })


    

   
})


