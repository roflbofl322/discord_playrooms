const Discord = module.require('discord.js');
const mongoose = require("mongoose");
const db = require('../../category_dbSchema');

//name 
//image url 
//Friednly name 


module.exports.run = async (client, message, args) => 
{
  if (message.author.id != "520213912159911936")
  {
    console.log("ur not the one...sry.")
    return;
  }
  else{
    
  

  if(!args[0])
    {
      console.log("Sry return there is no args")
      return
    }else{

    await db.data.findOne({category: args[0]} , {category: 1 , _id: 0}, (err,data)=>
    {
        try
        {
          console.log(data.category + "There is such category already")
          return;
        }
        catch(error){
          // console.log("There is no such category")
          var db_data = new db.data({category: args[0], image_url: args[1] ? args[1] : "https://i.imgur.com/tXEB2vZ.png" ,friendly_name: args[2] ? args[2] : args[0], color1: args[3] ? args[3] : "#7491d5" , color2: args[4] ? args[4] : "#005b9f"     });
          db_data.save((err,serv) =>{
          if(err) return console.log(err);
          console.log(serv.category + " saved to db")
          });
        }
    })
    }


  }
}


module.exports.help = {
    name: "add_category"
}