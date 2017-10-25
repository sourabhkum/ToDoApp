var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
var MONGODB_URI='mongodb://kumar:kumar7852@ds127065.mlab.com:27065/todos'
mongoose.connect(MONGODB_URI,{ useMongoClient: true });

module.exports={mongoose}