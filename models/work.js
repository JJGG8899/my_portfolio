var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkSchema = new Schema({
  title: String,
  demoPic: String,
  shortDesc: String,
  technologies: String,
  role: String,
  category: String,
  client: String,
  clientPic:String,
  clientLink:String,
});

module.exports = mongoose.model('Work', WorkSchema);
