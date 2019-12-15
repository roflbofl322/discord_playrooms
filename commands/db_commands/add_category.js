const Discord = module.require('discord.js');
const mongoose = require("mongoose");
const db = require('../../category_dbSchema');

module.exports.run = async (client, message, args) => 
{

  if(!args[0])
    {
      return
    }else if(args[1])
    {
      return
    }
    db.data.findOne({category: args[0]} , {category: 1 , _id: 0}, (err,data)=>
    {
        try
        {
          // console.log(data.category + "There is such category already")
          return;
        }
        catch(error){
          // console.log("There is no such category")
          var db_data = new db.data({category: args[0]});
          db_data.save((err,serv) =>{
          if(err) return console.log(err);
          console.log(serv.category + " saved to db")
          });
        }
    })


  }


module.exports.help = {
    name: "add_category"
}