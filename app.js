const express = require("express");
const app = express();
app.use(express.static('public'))
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const socketio = require("socket.io");
const io= socketio(server);
const Filter = require("bad-words");
const path = require("path");
const messagegeneratorfunction = require("./utils/messages");
const useroperations = require("./utils/users");



io.on("connection",(socket)=>{


    // socket.emit("counter",count);

    // socket.on("increase",()=>{
    //     count++;

    //     io.emit("counter",count);
    // })
    

    

    socket.on("join",(data,callback)=>{

        var user = {
            id:socket.id,
            username:data.username,
            room:data.room
            
        }
        const object = useroperations.adduser(user.username,user.room,user.id);
      //  console.log(data);
      console.log(object);
      if(object.error)
      {
        return  callback(object.error);
      }
      console.log(object);
        socket.join(object.room);
        const mymessage = "welcome"
        socket.emit("message",messagegeneratorfunction.messagegenerator("Admin",mymessage));
        const z = object.username+" has entered";
        socket.broadcast.to(object.room).emit("message",messagegeneratorfunction.messagegenerator("Admin",z));
        socket.emit("roomdata",{
            room:object.room,
            listusers:useroperations.getusersinroom(object.room),
        })
    })

    socket.on("sendmessage",(message,callback)=>{
        const filter = new Filter();
        filter.addWords("madarchod","bc","mc","gandu","bawligand","bhadwe");
        if(filter.isProfane(message))
        {
            return callback("don't use foul language");
        }
        const x = useroperations.getuser(socket.id);
        console.log(x);
        io.to(x.room).emit("message",messagegeneratorfunction.messagegenerator(x.username,message))
       //callback("the message has been deliverd");
    })

     socket.on("sendlocation",(coords,callback)=>{
        // console.log(coords);
        const user = useroperations.getuser(socket.id);
        var msg = "https://google.com/maps?q="+coords.latitude+","+coords.longitude;
         io.to(user.room).emit("sendlocationmessage",messagegeneratorfunction.locationgeneratormsg(user.username,msg));
         callback();
    })

    socket.on("disconnect",()=>{
        const user  = useroperations.removeuser(socket.id);
        if(user)
        {
            io.to(user.room).emit("message",messagegeneratorfunction.messagegenerator( "Admin",user.username+" has left the room"));
        }
        
    })

    console.log("webconnection is established");
})

 app.get("/",(req,res)=>{
     res.sendFile(__dirname+"/public/html/index.html")
 })
  
  app.get("/chat.html",(req,res)=>{
      res.sendFile(__dirname+"/public/html/chat.html")
  })


server.listen(port,()=>{
    console.log("Server has started at port no",port);
})