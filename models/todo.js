const mongoose=require('mongoose');
const UserSchema=require('./user');
var TodoSchema=new mongoose.Schema({
    text:{
        type:String,
        required: true
    },
    completed:{
        type:Boolean,
        default: false
    },
    completedAt: {
       type:Number,
       default: null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    }
});

var Todo=mongoose.model('Todo',TodoSchema);
module.exports={
    Todo:Todo,
    TodoSchems:TodoSchema}