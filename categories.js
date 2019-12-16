const mongoose = require("mongoose");
const Discord = module.require('discord.js');
const db = require('./category_dbSchema');
// const all_rooms = require('../../all_rooms');

let categories = []


    try{
    db.data.find({} , {category : 1 , _id: 0    } , (err , data)=>{
        // categories.push(data)
        data.forEach(element => {
            categories.push(element.get('category'))
        });
        module.exports.categories  = categories
     });
    }catch(error)
    {
        console.log(error)
    }
     





