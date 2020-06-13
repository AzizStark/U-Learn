const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for Post
const MessageSchema = new Schema({
    users: {
        type: Array,
        required: [true, 'Usernames required'],
        maxlength: 3,
    },

    messages: {
        type: Array,
        value: {
            source: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        },
        maxlength: 10000
    }
})


//create model for posts
const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
