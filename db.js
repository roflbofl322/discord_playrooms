const mongoose = require("mongoose");
var dataSchema = new mongoose.Schema({
    server_id:  String,
      room_id:  String,
    game_type:  String,
    room_name:  String,
  server_name:  String,
  iconURL    :  String

  });

  var data = mongoose.model('data', dataSchema);

  module.exports = {
    dataschema : dataSchema,
    data: data
  }