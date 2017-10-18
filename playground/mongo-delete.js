const { MongoClient,objectID} = require('mongodb');
MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if (error) {
        console.log('Database connection failed');
    }
    console.log("Database connected");
    //DeleteMany
    // db.collection('Todos').deleteMany({ test: 'Go to market' }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Not deleted', err);
    // });

    // db.close();
    //DeleteOne
    // db.collection('Todos').deleteOne({test:'Go to market'}).then((result)=>{
    //     console.log(result);
    // },(err)=>{
    //     console.log('Not Deleted',err);
    // });
    
    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({test:'Go to market'}).then((result)=>{
    //     console.log(result);
    // },(err)=>{
    //     console.log('Not Deleted',err);
    // });

    // db.collection('Users').deleteMany({name:"Sourabh"}).then((result)=>{
    //     console.log(result);
    // },(err)=>{
    //     console.log('Users not Deleted',err);
    // });
    db.collection('Users').findOneAndDelete({
        _id: new objectID('59e6d008e25b2a0fc49f5408')
    }).then((result)=>{
            console.log(JSON.stringify(result,undefined,2));
        },(err)=>{
            console.log(err);
        });
});

