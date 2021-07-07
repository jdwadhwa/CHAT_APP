var socket = io();

const div = document.querySelector("#mes");
// socket.on("counter",(count)=>{
//     console.log("the count is",count);
// })

const sidebartemplate = document.querySelector("#sidebar-template").innerHTML;

var urltemplate = document.querySelector("#url-template").innerHTML;

var parseQueryString = function(queryString) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};
const names = parseQueryString(location.search);
const username = names["?username"];
const room  = names["room"]
// console.log(username,room);
// var x = document.getElementById("co");
// //console.log(button);

//  x.addEventListener("click",()=>{
//      socket.emit("increase");
//  })
const messagetemplate = document.querySelector("#message_template").innerHTML;
var button = document.querySelector("#submit");

button.addEventListener("click",submitform);

function submitform(e)
{
    e.preventDefault();
    button.disabled = true;
    var input = document.querySelector("#mess");

    if(input.value!="")
        { var m = input.value

            socket.emit("sendmessage",m,(error)=>{
                
                if(error)
                {
                    console.log(error);
                }
                else{
                    console.log("the message has been delivered");
                }
            });
            button.disabled = false;
        input.value = "";
    }

}

// socket.on("print_message",(mess)=>{
//     console.log(mess);
// })

var sendl = document.querySelector("#send-location");


 sendl.addEventListener("click",()=>{
    navigator.geolocation.getCurrentPosition(pos=>{
        sendl.disabled =true;
         var location = { latitude: pos.coords.latitude,         
               longitude: pos.coords.longitude
        }
        socket.emit("sendlocation",location,()=>{
            console.log("the location has been sent");
            sendl.disabled = false;
        });
    })

 })




socket.on("message",(mess)=>{

    var html = Mustache.render(messagetemplate,{
        username:mess.username,
        message:mess.message,
        time:moment(mess.currenttime).format("h:mm:A"),
    });
    div.insertAdjacentHTML("beforeend",html);
    console.log(mess);

})

socket.on("sendlocationmessage",(location)=>{
    var html = Mustache.render(urltemplate,{
        username:location.username,
        url:location.message,
        time:moment(location.currenttime).format("h:mm:A"),
    })
    div.insertAdjacentHTML("beforeend",html);
    console.log(location);
})

socket.emit("join",({
    username:username,
    room:room
}),(error)=>{
    if(error)
    {
        alert(error);
        location.href="/"
    }
})


socket.on("roomdata",(data)=>{
    var html = Mustache.render(sidebartemplate,{
        room:data.room,
        users:data.listusers
    })

    document.querySelector("#sidebar").innerHTML=html

    console.log(data.room);
    console.log(data.listusers);
})