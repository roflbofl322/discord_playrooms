const mongoose = require("mongoose");
var dataSchema = new mongoose.Schema({
    category:  String,
    image_url: String,
    friendly_name: String,
    color1: String,
    color2: String


  }, {collection: 'categories'});

  var data = mongoose.model('categoires', dataSchema);

  module.exports = {
    dataschema : dataSchema,
    data: data
  }