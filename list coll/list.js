const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/project1?retryWrites=true&w=majority';
const dbName = 'project1';

async function listCollections() {
  const a = await MongoClient.connect(uri);
  const coll = await a.db(dbName).listCollections().toArray();
  coll.forEach(collection => {
    console.log(collection.name);
  });
  
  await a.close();
}

listCollections();
