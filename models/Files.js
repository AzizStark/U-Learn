const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for Post
const FileSchema = new Schema({

  name: {
    type: String,
    required: [true, 'Post ID needed'],
  },
  
  filedata: {
    type: Buffer,
    required: [true, 'File required'],
  }

})


//create model for posts
const FileModel = mongoose.model('File', FileSchema);

module.exports = FileModel;
