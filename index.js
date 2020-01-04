let express = require('express');
let app = express();
const Discord = require("discord.js");
const client = new Discord.Client();
let bodyParser = require("body-parser");
const config = require("./config.json");
client.login(config.token);
let path = require ("path");
const mongoose = require("mongoose");
const fs = require('fs');
let all_rooms = require('./all_rooms');
const db = require('./db')
let myFlag = 1
const categories = require('./category_dbSchema')
let all_categories = require("./categories")
let initialized = [];




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
      //YES: -> open it and assign all js files to 'jsfiles' letiable
      //NO:  -> assign js file to 'jsfiles' letiable
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

if (command == "!refresh")
{
  // console.log("yes command equals refresh")
  if(myFlag){
  //grab all rooms again 
  try{
    initialized = []
    all_categories = []
    await categories.data.find({} , {category : 1 , _id: 0    } , (err , data)=>{
        data.forEach(async element => {
            await all_categories.push(element.get('category'))
        });
    });
    console.log(all_categories)
    console.log( "All_categories.lenght:"+ all_categories.length )
    console.log("all_categories was grabbed inside 'ready' event")
    console.log("")

    let refreshed_rooms = []
    await db.data.find({} , {room_id: 1 , _id:0 , game_type: 1 , room_name: 1 ,server_name: 1 , server_id: 1 , iconURL: 1    } , async (err , data)=>{    
         data.forEach(async elem =>{
              // initialized.push(elem);
              console.log(elem)
              // const members_i = await channelMembers(elem.room_id)
              // console.log(members_i)
              // console.log("Above is members_i variable inside ready event")
              // console.log("For this room id: "+ elem.room_id)
              await init_room(elem.room_id , elem.server_id , elem)

        })
     
    });
    console.log(initialized)
    console.log("this above is initialized")

    myFlag = 0
    function flag() {
      myFlag = 1
    }
    message.channel.send("Refreshed.")
    setTimeout(flag, 3000);
    }
    catch(err)
    {
      console.log(err)
    }
  }else{message.channel.send("There are lots of commands i'm prociding right now. **Please try again after 3-5 seconds**.")}

}//->if command equals "refresh" END
else if(command == "!add_room")
{

  const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0xfd6102')
	.setTitle('!add_room')
	.setURL('https://discord.js.org/')
	.setAuthor('Lilith')
	.setDescription('Please use the following template: !add_room roomID game_type')
  .addField('game_types:', 'dota2, cs, ** !get_categories** ', true)
  .addField('Example', '!add_room 13372281488 dota2',true)
  // .addField('game_types:', '**!get_categories** for all categories', true)



    if(!message.member.hasPermission("ADMINISTRATOR") )
    {
      message.channel.send("You dont have enough permissions on this server")
      return 
      
    }else{

    const categories = require('./categories')
    let args = messageArray.slice(1); // аргументы после команды
    // console.log(categories.categories)
    if(args[0] == undefined){
      message.channel.send(exampleEmbed);
      return;}else if(!(message.guild.channels.get(args[0])))
      {
        message.channel.send("There is no room on this server with that ID.")
        return
      }
    if(args[1] == undefined){
      message.channel.send(exampleEmbed);
      return;}else if(!categories.categories.includes(args[1]))
      {
        message.channel.send("Sry, there is no category matched: \""+args[1]+"\". Type **!get_categories** command and choose from the list")
        return
      }


      db.data.findOne({room_id: args[0]} , { }, (err,data)=>
    {
        if(data)
        {
          message.channel.send("This room is already on the monitoring")
          // console.log(data)
          return;
        }
        else{
          // let db_data = new db.data({category: args[0]});
          // db_data.save((err,serv) =>{
          // if(err) return console.log(err);
          // console.log(serv.category + " saved to db")
          // });
          // console.log("There is no room like this in db")
          
         let guild = client.guilds.get(message.guild.id);
         let channel_name = guild.channels.get(args[0]).name;
         let db_data = new db.data({server_id: message.guild.id  , room_id: args[0] , game_type: args[1].toLowerCase() , room_name: channel_name , server_name: message.guild.name , iconURL: message.guild.iconURL+"?size=512"});
  
    // console.log(channel.name);

    db_data.save((err,serv) =>{
      if(err) return console.log(err);
      message.channel.send(serv.room_id + " saved to db. Enter room and check website!")
      
      
      let refreshed_rooms = []
      db.data.find({room_id: args[0]} , {room_id: 1 , _id:0 , game_type: 1 , room_name: 1 ,server_name: 1 , server_id: 1 , iconURL: 1    } , async (err , data)=>{
   
    try{
      console.log(data)
      data.forEach(elem =>{
        refreshed_rooms.push(elem);
        //  console.log("From try block after push initialize  looks like: " + initialized)
      })
      // console.log(refreshed_rooms)
      refreshed_rooms.forEach(async room =>{
        try{
          init_room(room.room_id , room.server_id , room)
          // console.log(room.room_id)
        }catch(bofl)
        {
          console.log(bofl)
        }
      })
    }catch(rofl)
    {
      console.log(rofl)
    }
});

    });
        }
    })
    
    // console.log("All rooms are initialized by now like this: " + initka.initialized[0].room_link)
  }




}else if(command == "!get_initialize")
{
  try{
    console.log(initialized)
  }catch(err)
  {
    message.channel.send(err)
  }
} else if(command == "!delete_room")
{
  try{
    if(!message.member.hasPermission("ADMINISTRATOR") )
    {
      message.channel.send("You dont have enough permissions on this server")
      return 
      
    }else{
    let args = await messageArray.slice(1); // аргументы после команды
    let channel_to_remove_from_db = await args[0] ;

    if(args[0] == undefined){
      message.channel.send("Please specify room ID you want to delete (**!delete_room 13372281488 **)");
      return;}else if(!(message.guild.channels.get(args[0])))
      {
        message.channel.send("There is no room on this server with that ID.")
        return
      }

    for (let i = 0 ; i < initialized.length  ; i++)
              {
                if(initialized[i].room.room_id == channel_to_remove_from_db)
                {
                  initialized.splice(i , 1)
                  message.channel.send("Room was deleted from monitoring")
                }
              }
    await db.data.deleteOne({room_id: channel_to_remove_from_db}, async function(err) {
      if (!err) {
              console.log("Room deleted succesfully")
      }
      else {
              console.log(err)
      }
      
    
  });
  }
  }catch(err)
  {
    console.log(err)
  }

}
else{
let args = messageArray.slice(1); // аргументы после команды
let command_file = client.commands.get(command.slice(prefix.length)) ;

if (command_file) {
  
  if(myFlag){
    
    
  command_file.run(client, message, args);
  myFlag = 0
    function flag() {
      myFlag = 1
    }
    setTimeout(flag, 3000);
    
    
}else{
  message.channel.send("There are lots of commands i'm prociding right now. **Please try again after 3-5 seconds**.")
}
}
}})
//Bot command procedure END
//////////////////////////////////////////                      


async function channelMembers (room_ID) { // return Array
  
  try{
    console.log("im inside channelMembers function")
    console.log(room_ID)
    console.log("Proceeding the memebers_of the channel")
  let arrayName = [];
  let members_of_the_channel = await client.channels.get(room_ID).members;
  console.log(members_of_the_channel)
  console.log("those above are channel members inside 'channelMembers function'")
  
  for await (let mapV of members_of_the_channel.values()) {
    const avatarurl = "https://cdn.discordapp.com/avatars/"+ mapV.user.id+"/"+mapV.user.avatar+".jpg?size=512"
    arrayName.push({nickname: mapV.user.username , avatar: avatarurl});
  }
  console.log(arrayName)
  console.log("arrayName has been initialized inside channelMembers fucntion ")
  return arrayName;
  }
  catch(members_error)
  {
    let arrayName = []
    console.log("(from catch members_error block)Sry there is no members in this room: " + room_ID)
    return arrayName;
  }
  
  

  
}
async function init_room (room_ID , server_ID , room)
{
  try{
    const members_i =  await channelMembers(room_ID)
    const guild_i =  await client.guilds.get(server_ID)
    const channel_i = await guild_i.channels.get(room_ID);
    const URL_i = await channel_i.createInvite();
    // console.log(channel_i.userLimit)
    initialized.push({room: room ,members: members_i , room_link: URL_i.url , room_min: (members_i) ? members_i.length : 0  , room_max: channel_i.userLimit  })

  }catch(err){
    console.log("sry bruh there is no members")
    console.log(err)
  }
}


function getChannelLink (link , URL)
{
  link.then(prom => {URL = link.url ; return URL})
}

//Set public folder 
app.use(express.static(path.join(__dirname , 'public')));



 client.on("ready", async () => {
 
try{
    all_categories = []
    await categories.data.find({} , {category : 1 , _id: 0    } , (err , data)=>{
        data.forEach(async element => {
            await all_categories.push(element.get('category'))
        });
    });
    console.log(all_categories)
    console.log( "All_categories.lenght:"+ all_categories.length )
    console.log("all_categories was grabbed inside 'ready' event")
    console.log("")

    let refreshed_rooms = []
    await db.data.find({} , {room_id: 1 , _id:0 , game_type: 1 , room_name: 1 ,server_name: 1 , server_id: 1 , iconURL: 1    } , async (err , data)=>{    
         data.forEach(async elem =>{
              // initialized.push(elem);
              console.log(elem)
              // const members_i = await channelMembers(elem.room_id)
              // console.log(members_i)
              // console.log("Above is members_i variable inside ready event")
              // console.log("For this room id: "+ elem.room_id)
              await init_room(elem.room_id , elem.server_id , elem)

        })
        // console.log(refreshed_rooms)
        // console.log("Refreshed_rooms.lenght: " + refreshed_rooms.length)
        // console.log("all rooms from db taken into refreshed_rooms inside 'ready' event ")
        // console.log("")
    });
    console.log(initialized)
    console.log("this above is initialized")

    
    // refreshed_rooms.forEach(room =>{
    //     init_room(room.room_id , room.server_id , room)    
    // })
    // console.log(initialized)
    // console.log("initialized variable after 'init_room' function inside 'ready' ")
    
}
catch(err)
{
  console.log(err)
}
});

client.on("channelDelete", async (channel)=>{
  // console.log(channel.id)
  try{
  let channel_to_remove_from_db = await channel.id.toString();
  for (let i = 0 ; i < initialized.length  ; i++)
            {
              if(initialized[i].room.room_id == channel_to_remove_from_db)
              {
                initialized.splice(i , 1)
              }
            }
  await db.data.deleteOne({room_id: channel_to_remove_from_db}, async function(err) {
    if (!err) {
            console.log("Room deleted succesfully")
    }
    else {
            console.log(err)
    }
    
  
});
}catch(err)
{
  console.log(err)
}
})

client.on("voiceStateUpdate" , async (oldMember, newMember) => {  
  //When someone joining channel without room before
  if(oldMember.voiceChannelID == undefined && newMember.voiceChannelID != undefined){
    initialized.forEach( async elem=>{
    if(elem.room.room_id == newMember.voiceChannelID){
      let members = []
       let temp_members = await channelMembers(elem.room.room_id);
      for await (let temp of temp_members)
      {
        members.push(temp)
      }
      console.log(members)
      elem.members = members
      elem.room_min += 1;
      
      console.log(typeof(members))
      console.log("no channel before -> entered room")
    }});
  // console.log(initialized);
}
  //When someone joining channel END
 

  //When someone leaving channel
  else if (newMember.voiceChannelID == undefined){
    //if someone left room
    initialized.forEach( async elem=>{
    if(elem.room.room_id == oldMember.voiceChannelID){
      let members = []
       let temp_members = await channelMembers(elem.room.room_id);
      for await (let temp of temp_members)
      {
        members.push(temp)
      }
      console.log(members)
      elem.members = members
      elem.room_min -= 1;
    }})
    // console.log(initialized);
  console.log("Yes i was in the room ->  and i left it")}
  else{
    // console.log("and here comes the shit")
    // console.log("I was sitting here" + oldMember.voiceChannel.name)
    // console.log("And now i'm sitting here" + newMember.voiceChannel.name)
  
    initialized.forEach(async elem=>{
      if(elem.room.room_id == oldMember.voiceChannelID){
        let members = []
       let temp_members = await channelMembers(elem.room.room_id);
      for await (let temp of temp_members)
      {
        members.push(temp)
      }
      console.log(members)
      elem.members = members
        elem.room_min -= 1;
        
      }})
      initialized.forEach( async elem=>{
        if(elem.room.room_id == newMember.voiceChannelID){
          let members = []
       let temp_members = await channelMembers(elem.room.room_id);
      for await (let temp of temp_members)
      {
         members.push(temp)
      }
      console.log(members)
      elem.members = members
          elem.room_min += 1;
          console.log("no channel before -> entered room")
        }});  
      
  }
  //When someone leaving channel END
});

 //1 no room before -> enter room
  //2 leaving room
  //3 changed room 

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
   console.log("Page was updated")
  res.status(200).json({
      initialized,
      all_categories
  })

  // client.channels.get('611158172354347041').send("someone entered site");
}) 
app.listen(5555 , ()=>{
  console.log("Server is started.");
  });
  








