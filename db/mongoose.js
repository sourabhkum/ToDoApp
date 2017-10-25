var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
MONGODB_URI='mongodb://<sourabhcybo>:<Sourabh@7852>@ds127065.mlab.com:27065/todos'
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/TodoApp',{ useMongoClient: true });

module.exports={mongoose}