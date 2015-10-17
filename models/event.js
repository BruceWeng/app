// grab the packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// event schema
var EventSchema = new Schema({
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  desc: { type: String, required: true },
  s_date: { type: Date, required: true },
  e_date: { type: Date, required: true },
  c_date: { type: Date, required: true },
  lct: {type: String, required: true},
  categories: { type: String, required: true },
  creator: { type: String },
  img_url: { type: String },
  follow_count: { type: Number}
})

// return the model
module.exports = mongoose.model('Event', EventSchema);