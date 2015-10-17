// grab the packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// event schema
var EventSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  s_date: { type: Date, required: true },
  e_date: { type: Date, required: true },
  c_date: { type: Date, required: true },
  categories: { type: Array, required: true },
  creator: {
    name: { type: String },
    photo: { type: String },
    profile_url: { tye: String }
  },
  img_url: { type: String },
  follow_count: { type: Number}
})