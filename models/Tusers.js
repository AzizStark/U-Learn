const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for todo
const TSignSchema = new Schema({
  userName:{
    type: String,
    required: true,
    required: [true, 'Enter UserName']
    },
  email:{
    type: String,
    required: [true, 'Enter UserName']
   },
  password:{
    type:String,
    required:[true,'Enter password']
  },
  pepper: {
    type: String,
    required: [true, 'Pepper required']
  },
  courses: {
    type: Array,
    maxlength: 100
  },
  messages: {
    type: Array,
    maxlength: 10000
  }
})

//create model for todo
const Tuser = mongoose.model('Tuser', TSignSchema);

module.exports = Tuser;
