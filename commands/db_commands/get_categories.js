const mongoose = require("mongoose");
const Discord = module.require('discord.js');
const db = require('../../category_dbSchema');
// const all_rooms = require('../../all_rooms');

let categories = []

module.exports.run = async (client, message, args) => 
{
    db.data.find({} , {category : 1 , _id: 0    } , (err , data)=>{
      
        // console.log(categories)
        message.channel.send(data)
        // module.exports.categories = categories
     });
     
}



module.exports.help = {
    name: "get_categories"
}
