const Discord = module.require('discord.js');
const mongoose = require("mongoose");
const db = require('../../db.js');


const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0xfd6102')
	.setTitle('!add_room')
	.setURL('https://discord.js.org/')
	.setAuthor('Lilith')
	.setDescription('Please use the following template: !add_room roomID game_type')
	.addField('game_types:', 'dota2 pubg lol cs', true)
	.addField('Example', '!add_room 13372281488 dota2',true)


module.exports.run = async (client, message, args) => 
{
    
    if(args[0] == undefined){
      message.channel.send(exampleEmbed);
      return;}
    if(args[1] == undefined){
      message.channel.send(exampleEmbed);
      return;}
   
    
    var guild = client.guilds.get(message.guild.id);
    var channel = guild.channels.get(args[0]);
    var db_data = new db.data({server_id: message.guild.id  , room_id: args[0] , game_type: args[1].toLowerCase() , room_name: channel.name , server_name: message.guild.name , iconURL: message.guild.iconURL});
  
    // console.log(channel.name);

    db_data.save((err,serv) =>{
      if(err) return console.log(err);
      console.log(serv.server_id + " saved to db")
    });
    // console.log("All rooms are initialized by now like this: " + initka.initialized[0].room_link)


}

module.exports.help = {
    name: "add_room"
}
