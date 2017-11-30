require('dotenv').config();
let env = process.env.NODE_ENV;
if (env === 'development') {
    PORT = process.env.PORT;
    MONGO_URI = process.env.MONGO_URI;
} else if (env === 'test') {
    PORT = process.env.PORT;
    MONGO_URI = process.env.MONGO_URI;
}
module.exports = {
    PORT: PORT,
    MONGO_URI: MONGO_URI
}