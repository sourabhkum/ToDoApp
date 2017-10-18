const { MongoClient, objectID } = require('mongodb');
MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if (error) {
        console.log('Database connection failed');
    }
    console.log("Database connected");
    db.collection('Users').findOneAndUpdate({
        _id: new objectID('59e6d65d0eaa2b884a1559fd')
    }, {
          $set: {
                completed: true
            }
        }, {
            returnOrignal: false
        }).then((result) => {
            console.log(result);
        }, (err) => {
            console.log(err);
        });
});

