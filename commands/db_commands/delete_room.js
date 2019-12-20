const Discord = module.require('discord.js');
const mongoose = require("mongoose");
const db = require('../../db.js');

module.exports.run = async (client, message, args) => 
{

    if(!message.member.hasPermission("ADMINISTRATOR"))
    {
        // console.log("You dont have enough permissions for this operation")
        message.channel.send("You dont have enough permission for that, bruh.")
        return
    }
    else{
    if(!message.guild.channels.get(args[0]))
    {
        message.channel.send("There is no room like this on this server to delete")
        return
    }
    // !delete_room room_id
    let room_id_to_delete = args[0].toString();
    // console.log(typeof(room_id_to_delete))
    db.data.deleteOne({room_id: room_id_to_delete }, function(err) {
        if (!err) {
                message.type = 'notification!';
                message.channel.send(serv.server_id + " removed from db. Type **!refresh** for applyting the changes")
        }
        else {
                message.type = 'error';
        }
    });
    // console.log(args[0])
    }
}


module.exports.help = {
    name: "delete_room"
}