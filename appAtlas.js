
const { MongoClient } = require('mongodb');
const fs = require('fs');

const credentials = './X509-cert-1630551719596210538.pem'

const client = new MongoClient('mongodb+srv://cluster0.en4vy.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    sslKey: credentials,
    sslCert: credentials
});

async function run() {
    try {
        await client.connect();
        const database = client.db("testDB");
        const collection = database.collection("testCol");
        const docCount = await collection.countDocuments({});
        console.log(docCount);
        // perform actions using client
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);
