var mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');
const TodoSchema=require('./todo');
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        minlenght:6,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not Valid',
            isAsync:false
        }
    },
    password:{
        type:String,
        require:true,
        minlenght:6
    },
    imageUrl  :{
        type:String
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }

    }]
});
UserSchema.methods.toJSON=function(){
    var user=this;
    var userObject=user.toObject();
    return _.pick(userObject,['_id','email','name','mobile','imageUrl']);
};

UserSchema.methods.generateAuthToken=function(){
    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.methods.removeToken=function(token){
    var user=this;
    return user.update({
        $pull:{
          tokens:{token}
        }
    });
};

UserSchema.statics.findByToken=function(token){
    var User=this;
    var decode;
    try{
      decode=jwt.verify(token,'abc123');

    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        '_id':decode._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
            
        });
    }else{
        next();
    }
});
UserSchema.statics.findByCredentials=function(email,password){

    var user=this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject;
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            })
        });
    });
};
var User=mongoose.model('User',UserSchema);
module.exports={
    User:User,
    UserSchema:UserSchema
}