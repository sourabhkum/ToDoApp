var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp',{ useMongoClient: true });
var User=mongoose.model('User',{
    email:{
        type:String,
        required:true,
        minlenght:6,
        trim:true
    }
});
var newUser=new User({
    email:'kumar@gmail.com'
});
newUser.save().then((result)=>{
console.log(`user created ${JSON.stringify(result,undefined,2)}`);
},(err)=>{
console.log('user creation failed');
})
// var Todo=mongoose.model('Todo',{
//     text:{
//         type:String,
//         required: true
//     },
//     completed:{
//         type:Boolean,
//         default: false
//     },
//     completedAt: {
//        type:Number,
//        default: null
//     }

// });
// var newTodo=new Todo({
//     text:'cooking Vegetable',
//     completed:false,
//     completedAt:10
// });

// newTodo.save().then((result)=>{
//     console.log(JSON.stringify(result,undefined,2));
// },(err)=>{
//     console.log('Todo not added',err)
// });
