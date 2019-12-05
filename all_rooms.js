const mongoose = require("mongoose");
const db = require('./db');
let all_rooms = [];

 db.data.find({} , {room_id: 1 , _id:0 , game_type: 1 , room_name: 1 ,server_name: 1 , server_id: 1 , iconURL: 1    } , (err , data)=>{
    data.forEach(elem =>{
        all_rooms.push(elem);
    })
 
});

module.exports.rooms = all_rooms;

