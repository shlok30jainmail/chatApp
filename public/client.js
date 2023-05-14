const socket = io();

// personal
const btn = document.querySelector('.list-btn');
const body = document.querySelector('.chat-section');

btn.addEventListener('click', ()=>{
    const userList = document.querySelector('.user-list');
//    userList.style.display = 'block';
   userList.classList.toggle('v');
})
// end personl 

// const count = require('../server')

let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');
let users_list = document.querySelector('.user-list')
let users_count = document.querySelector('.countUser')

// let countUser = document.querySelector('.countUser');
// var count =0;
do{
     name = prompt('Please Enter Your Name')
}while(!name)


// join and left message 
socket.emit("new-user-joined", name);
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined')
})

function userJoinLeft(username,status){
    let div = document.createElement('div');
    div.classList.add('user-join');
   let content = `<p><b>${username}</b> ${status} the chat<p>`;
   div.innerHTML = content;
   messageArea.appendChild(div);
}
socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'Left');

})

// user-list
socket.on('user-list',(users)=>{
    users_list.innerHTML =`<h3>People</h3>`;
    let users_arr =Object.values(users);
    for(i=0; i< users_arr.length; i++){
        let p = document.createElement('p');
        p.innerHTML = users_arr[i];
        users_list.appendChild(p);
    }

  users_count.innerHTML = `Total People ${users_arr.length}`;
});



// main message sending
textarea.addEventListener('keyup',(e)=>{
if(e.key === 'Enter'){
    sendMeassage(e.target.value)
}
})


function sendMeassage(message){
    let msg={
        user: name,
        message: message.trim()
    }
    // Append 

    appendMessage(msg,'outgoing');
    textarea.value ="";
    scrollToBottom();


    //Send to server
    socket.emit('message', msg)


    /// start
// fetching initial chat messages from the database
(function() {
    fetch("/chats")
    .then(data  =>  {
    return  data.json();
    })
.then(json  =>  {
json.map(data  =>  {
let  div  =  document.createElement("div");
let messages = document.getElementsByClassName("message_area")

let className = type;
div.classList.add(className,'message');
// let  span  =  document.createElement("span");
// messages.appendChild(li).append(data.message);
let markup = `
    <h4>${data.sender}</h4>
    <p>${data.message}<p>
    `
    div.innerHTML = markup;
    messages.appendChild(div);

    // messages
    // .appendChild(span)
    // .append("by "  +  data.sender  +  ": "  +  formatTimeAgo(data.createdAt));
});
});
})();

    // end
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div');
    // let markup = document.createElement('h4');

    let className = type;
    mainDiv.classList.add(className,'message');


     let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}<p>
    `
    // markup.classList.add('userName');

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}



// recieve message

socket.on('message', (msg)=>{
    // console.log(msg);
    appendMessage(msg,'incoming')
    scrollToBottom();
})


// scroll behavior
function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight;
}



// message seen and unseen
// const observer = new window.IntersectionObserver(([entry])=>{
//     if(entry.isIntersecting){
//      socket.emit('read-message', 'mm');
//      console.log('mm');
//      return
//     }
// },{
//     root: null,
//     threshold:0.1,

// })
// observer.observe(document.getElementById('mm'));
