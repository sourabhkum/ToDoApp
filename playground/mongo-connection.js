const {MongoClient,objectID} = require('mongodb');
MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if (error) {
        console.log('Database connection failed');
    } 
        console.log("Database connected");
    db.collection('Users').insertOne({
        name:'Sourabh',
        email:'sourabhcybo@gmail.com',
        mobile:8237251669
    },(error,results)=>{
        if(error){
            console.log('something went wrong');
        }
        console.log(JSON.stringify(results.ops,undefined,2))
    });
    db.close();
    
});

