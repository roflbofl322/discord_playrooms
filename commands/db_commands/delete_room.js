const Discord = module.require('discord.js');
const mongoose = require("mongoose");
const db = require('../../db.js');

module.exports.run = async (client, message, args) => 
{
    // !delete_room room_id
    let room_id_to_delete = args[0].toString();
    // console.log(typeof(room_id_to_delete))
    db.data.deleteOne({room_id: room_id_to_delete }, function(err) {
        if (!err) {
                message.type = 'notification!';
        }
        else {
                message.type = 'error';
        }
    });
    // console.log(args[0])
}


module.exports.help = {
    name: "delete_room"
}