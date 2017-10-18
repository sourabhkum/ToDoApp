var mongoose=require('mongoose');
var User=mongoose.model('User',{
    email:{
        type:String,
        required:true,
        minlenght:6,
        trim:true
    }
});
module.exports={
    User:User
}