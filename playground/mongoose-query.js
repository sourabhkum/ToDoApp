const {Todo}=require('../models/todo');
const {mongoose}=require('../db/mongoose');
const{objectID}=require('mongodb');
const{User}=require('../models/user');

var id='59e70b9ef122671fc0a095e2';
User.find({_id:id}).then((users)=>{
    console.log('Users',users);
});
User.findOne({_id:id}).then((user)=>{
    console.log('User',user);
});
User.findById(id).then((user)=>{
    if(!user){
        console.log('id not found');
    }
    console.log(JSON.stringify(user,undefined,2));
},(err)=>{
console.log('something went wrong');
});
// var id='69e86ba63bee5e136013542a';
// if(!mongoose.Types.ObjectId.isValid(id)){
// console.log('not valid Id');
// }
// Todo.find({_id:id}).then((todos)=>{
// console.log(todos);
// });

// Todo.findOne({_id:id}).then((todo)=>{
// console.log(todo);
// });
// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         console.log('Id not found')
//     }
//     console.log(todo);
// }).catch((e)=>console.log(e));