const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
        }
})

module.exports = mongoose.model("Event",EventSchema)