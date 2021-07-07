const messagegenerator = function(username,text)
{
    return {
        username:username,
        message:text,
        currenttime:new Date().getTime(),
    }
}


const locationgeneratormsg = function(username,text)
{
    return{
        username:username,
        message:text,
        currenttime:new Date().getTime(),
    }
}


module.exports = {
    messagegenerator:messagegenerator,
    locationgeneratormsg:locationgeneratormsg
}