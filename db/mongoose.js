const config = require('../server/config/config');
var mongoose=require('mongoose');
mongoose.Promise=global.Promise;

mongoose.connect(config.MONGO_URI,{ useMongoClient: true });
module.exports={mongoose}
