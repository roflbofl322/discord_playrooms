const mongoose = require("mongoose");
const Discord = module.require('discord.js');



module.exports.run = async (client, message, args) => 
{
    try{
    if(!args[0])
    {
    const channel = client.channels.get("642312920306548737");
    channel.join()
    }else{
        const channel = client.channels.get(args[0])
        channel.join()
    }}
    catch(err){
        console.log(err)
    }
}


module.exports.help = {
    name: "join"
}
