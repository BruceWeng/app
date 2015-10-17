// grab the packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// event schema
var Event Schema = new Schema({
  title: { type: String, required: true, }
  desc: String
})