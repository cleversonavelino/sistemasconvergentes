var MongoClient = require('mongodb').MongoClient;

module.exports = (collectionstr) => {

    const repository = {};

    var collection;
    
    var uri = "mongodb://positivo:123456ab@cluster0-shard-00-00.2bftd.mongodb.net:27017,cluster0-shard-00-01.2bftd.mongodb.net:27017,cluster0-shard-00-02.2bftd.mongodb.net:27017/sistemasconvergentes?ssl=true&replicaSet=atlas-fbg0ts-shard-0&authSource=admin&retryWrites=true&w=majority";
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log(err)
        }

        const db = client.db('sistemasconvergentes')
        collection = db.collection(collectionstr)       
    });

    repository.collection = () => {
        return collection;
    }

    return repository;
}