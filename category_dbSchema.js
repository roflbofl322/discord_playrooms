const mongoose = require("mongoose");
var dataSchema = new mongoose.Schema({
    category:  String

  }, {collection: 'categories'});

  var data = mongoose.model('categoires', dataSchema);

  module.exports = {
    dataschema : dataSchema,
    data: data
  }