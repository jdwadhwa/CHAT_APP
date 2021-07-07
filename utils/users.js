const users = [];



const adduser = function(username,room,id)
{
    username = username.trim().toLowerCase();

    room = room.trim().toLowerCase();


    if(!username || !room)
    {
        return {
            error:"naam toh daal madarchod"
        }
    }


    const existinguser =users.find(ele=>{
        return (ele.room==room && ele.username ==username)
    })

    if(existinguser)
    {
        return {
            error:"apna naam dal na madarchod"
        }
    }

    const user = {
        username:username,
        room:room,
        id:id
    }
    users.push(user);
    return user;



}

const removeuser = function(id)
{

        var index = users.findIndex(ele=>{
            return ele.id==id
        })
        if(index!=-1)
        {
            var x = users.splice(index,1);
            return x[0]; 
        }    




}

const getuser = function(id)
{
    var found =users.find(ele=>{
       // console.log(ele);
      // console.log(id);
        return ele.id===id
    })
    //console.log(x);
    return found;
}

const getusersinroom  = function(room)
{
    var userarray = users.filter(ele=>{
        if(ele.room===room)
        {
            return ele
        }
    })
    return userarray;
}

//    adduser("jatin","sanchay",11);
//  adduser("ram","sanchay",21);
//  adduser("kj","sna",10);
// //removeuser(21);
// var x = getuser(11);
// var z = getusersinroom("sanchay");
// // console.log(x);
// // console.log(users);
// console.log(z);
module.exports = {
    adduser:adduser,
    removeuser:removeuser,
    getuser:getuser,
    getusersinroom:getusersinroom
}