const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for todo
const SSignSchema = new Schema({
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
    value:
    {
      id: {
        type: String,
        required: true
      },
      cid: {
        type: String,
        required: true
      },
      title: {
        type: String,
      },
      tag: {
        type: String,
      },
      author: {
        type: String
      }
    }
  },
  messages: {
    type: Array,
    maxlength: 10000
  }
})

//create model for todo
const Suser = mongoose.model('Suser', SSignSchema);

module.exports = Suser;
