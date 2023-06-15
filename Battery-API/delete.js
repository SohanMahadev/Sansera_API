const { MongoClient } = require('mongodb');

async function deleteAllData() {
  const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/battery?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
      console.log(`Deleted all data from collection ${collection.name}`);
    }

    console.log('All data deleted from all collections');
  } catch (error) {
    console.error('Error deleting data:', error);
  } finally {
    await client.close();
  }
}

deleteAllData();