const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title:{
        type:String,
        required: true,
        unique:true

    },
    body:{
        type:String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    udatedAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);



 











