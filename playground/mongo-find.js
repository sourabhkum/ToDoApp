const { MongoClient, objectID } = require('mongodb');
MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if (error) {
        console.log('Database connection failed');
    }
    console.log("Database connected");


    db.collection('Users').find({ name: "monu" }).toArray().then((data) => {

        console.log('Users');
        console.log(JSON.stringify(data, undefined, 2));
    }, (err) => {

    });
    db.collection('Todos').find({ completed: false }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('not able to fetch data', err);
    });
});

