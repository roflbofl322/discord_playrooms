var express = require('express');
var app = express();
const Discord = require("discord.js");
const client = new Discord.Client();
var bodyParser = require("body-parser");
const config = require("./config.json");
client.login(config.token);
var path = require ("path");
const mongoose = require("mongoose");
const fs = require('fs');
let users = 0;
const all_rooms = require('./all_rooms');
const db = require('./db')


////////////////////////////////////
//Connect to DB
mongoose.connect(config.db_connection, {useNewUrlParser: true}).then(() => {
  console.log("Connected to database.");
  }).catch((err) => {
      console.log("Not Connected to Database ERROR! ", err);
  });
//Connect to DB
////////////////////////////////////
  
app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'pug');


//////////////////////////////////////////
//Read all commands from "commands" folder
client.commands = new Discord.Collection() // создаём коллекцию для команд
client.aliases = new Discord.Collection();
client.prefix = config.prefix;
client.owners = config.owners;

fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
  if (err) console.log(err)

  files.forEach((element,iterator) => 
  {
      //check if element is a folder ? 
      //YES: -> open it and assign all js files to 'jsfiles' variable
      //NO:  -> assign js file to 'jsfiles' variable
      if(!element.includes("."))
      {
          fs.readdir(`./commands/${element}`,(err,sub_files)=>{
              sub_files.forEach((elem,iterator)=>{
                  let props = require(`./commands/${element}/${elem}`);
                  client.commands.set(props.help.name, props);
              })
          }) 
      }
      else
      {
              let props = require(`./commands/${element}`);
           client.commands.set(props.help.name, props);
      }   
  }) 
})
//Read all commands from "commands" folder
//////////////////////////////////////////


//////////////////////////////////////////
//Bot command procedure
client.on('message', async message => {
  if (message.author.bot){

    if(message.content == "someone entered site")
    {
      // users = channelMembers(channelID);
      
    }
    return ;
  }
let prefix = config.prefix;
if(!message.content.startsWith(prefix)) return;
let messageArray = message.content.split(' ') ;// разделение пробелами
let command = messageArray[0]; // команда после префикса
console.log(command);
let args = messageArray.slice(1); // аргументы после команды
let command_file = client.commands.get(command.slice(prefix.length)) ;
if (command_file) command_file.run(client, message, args);
})
//Bot command procedure
//////////////////////////////////////////                      


function channelMembers (room_ID , server_ID) { // return Array
  var channelMembers = client.channels.get(room_ID).members;
  
  var arrayName = [];
  for (let mapV of channelMembers.values()) {
    const user_id = mapV.user.id
    // const avatarurl = client.guilds.get(server_ID).members.get(user_id).user.avatarURL
    // console.log(avatarurl)
    const avatarurl = "https://cdn.discordapp.com/avatars/"+ mapV.user.id+"/"+mapV.user.avatar+".jpg?size=128"
    
    arrayName.push({nickname: mapV.user.username , avatar: avatarurl});
    

  }
  return arrayName;
}
function getChannelLink (link , URL)
{
  link.then(prom => {URL = link.url ; return URL})
}

//Set public folder 
app.use(express.static(path.join(__dirname , 'public')));


var initialized = [];
 client.on("ready", async () => {
  all_rooms.rooms.forEach(async room=>{
  //   let members = channelMembers(room.room_id);
  //   let guild = client.guilds.get(room.server_id)
  //   let channel = guild.channels.get(room.room_id);
  //   let URL = await channel.createInvite()
  //  initialized.push({room: room ,members: members , channel_link: URL.url})
    
    try{
      const members =  channelMembers(room.room_id , room.server_id)
      
      // console.log(room)
      const guild = await client.guilds.get(room.server_id)
      const channel = await guild.channels.get(room.room_id);
      
      // let shits = channel.guild._rawVoiceStates
      // console.log(channel.guild._rawVoiceStates)
      // console.log(shits)
      // const mymemebers = channel.members
      // console.log(mymemebers)
      //channel.userlimit = max of the guys in the room 
      const URL = await channel.createInvite();
      console.log(channel.userLimit)
      initialized.push({room: room ,members: members , room_link: URL.url , room_min: members.length , room_max: channel.userLimit  })
      
    }catch(e)
    {
      console.log(e);
    }

  })
  function loggging_shit() {console.log(initialized)}
  setTimeout(loggging_shit, 5000);
  // console.log("I'm ready ^_^");
});

client.on("channelDelete",(channel)=>{
  // console.log(channel.id)
  let channel_to_remove_from_db = channel.id.toString();
  db.data.deleteOne({room_id: channel_to_remove_from_db}, function(err) {
    if (!err) {
            console.log(err)
    }
    else {
            console.log(err)
    }
});
  
})

client.on("voiceStateUpdate" , (oldMember, newMember) => {  
  //When someone joining channel
  if(oldMember.voiceChannelID == undefined){
    initialized.forEach(elem=>{
    if(elem.room.room_id == newMember.voiceChannelID){
      let members = channelMembers(elem.room.room_id);
      elem.members = members;}});
  console.log(initialized);}
  //When someone joining channel END

  //When someone leaving channel
  if (newMember.voiceChannelID == undefined){
    initialized.forEach(elem=>{
    if(elem.room.room_id == oldMember.voiceChannelID){
      let members = channelMembers(elem.room.room_id);
      elem.members = members;}})
    console.log(initialized);}
  //When someone leaving channel END
});

app.use((req ,res , next) => {
	res.header('Access-Control-Allow-Origin','*');
	//res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With , Content-Type , Accept, Auth');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
//if(req.method === "OPTIONS")
//{
//	res.header('Access-Control-Allow-Methods' , 'PUT , POST , PATCH, DELETE, GET');
//	return res.status(200).json({});
//}
});

 app.get('/', function(req, res) {
  console.log(users);
  res.status(200).json({
     initialized
  })

  client.channels.get('611158172354347041').send("someone entered site");
}) 
app.listen(5555 , ()=>{
  console.log("Server is started.");
  });
  








