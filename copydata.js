const { MongoClient } = require('mongodb');

async function copyData() {
  const sourceUri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/project1?retryWrites=true&w=majority';
  const destinationUri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/copy?retryWrites=true&w=majority';

  const sourceClient = new MongoClient(sourceUri);
  const destinationClient = new MongoClient(destinationUri);

  try {
    await sourceClient.connect();
    await destinationClient.connect();

    const sourceDB = sourceClient.db();
    const destinationDB = destinationClient.db();

    const sourceCollection = sourceDB.collection('users');
    const destinationCollection = destinationDB.collection('copied');

    const data = await sourceCollection.find().toArray();
    await destinationCollection.insertMany(data);

    console.log('Data copied successfully');
  } catch (error) {
    console.error('Error copying data:', error);
  } finally {
    await sourceClient.close();
    await destinationClient.close();
  }
}


copyData();
