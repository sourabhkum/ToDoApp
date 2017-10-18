const { MongoClient, objectID } = require('mongodb');
MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if (error) {
        console.log('Database connection failed');
    }
    console.log("Database connected");
    db.collection('Todos').findOneAndUpdate({
        _id: '59e5fcf10f12ee151cd5b320'
    }, {
          $set: {
            completed: false
            }
        }, {
            returnOrignal: true
        }).then((result) => {
            console.log(result);
        }, (err) => {
            console.log('not updated Record',err);
        });
});

