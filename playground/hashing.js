const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var password='123ac!';
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
        bcrypt.compare(password,hash,(err,result)=>{
            console.log(result);
        });
    });
    
});
// var data={
// id:10
// };
// var token=jwt.sign(data,'123abc');
// console.log(token);

// var decode=jwt.verify(token,'123abc');
// console.log(decode);
