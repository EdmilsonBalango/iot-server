const { MongoClient } = require('mongodb');

var db;
const uri = 'mongodb://13.60.90.181:27017';
const client = new MongoClient(uri);


client.connect().then(() => {
    db = client.db('IOT');
}).catch(err => {
    console.error('Failed to connect to database', err);
});

module.exports = { db, client };


