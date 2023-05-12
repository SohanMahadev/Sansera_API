/*const { MongoClient } = require('mongodb');

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

listCollections();*/ 
const { MongoClient } = require('mongodb');

async function copyData() {
  const sourceUri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/san_forge_develop_branch_test?retryWrites=true&w=majority';
  const destinationUri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/sansera?retryWrites=true&w=majority';

  const sourceClient = new MongoClient(sourceUri);
  const destinationClient = new MongoClient(destinationUri);

  try {
    await sourceClient.connect();
    await destinationClient.connect();

    const sourceDB = sourceClient.db();
    const destinationDB = destinationClient.db();

    const collections = await sourceDB.listCollections().toArray();

    let successCount = 0;
    let failureCount = 0;

    for (const collection of collections) {
      const sourceCollection = sourceDB.collection(collection.name);
      const destinationCollection = destinationDB.collection(collection.name);

      const cursor = sourceCollection.find();

      while (await cursor.hasNext()) {
        const document = await cursor.next();
        try {
          await destinationCollection.insertOne(document);
          successCount++;
          console.log(`Document copied successfully to collection ${collection.name}:`, document);
        } catch (error) {
          failureCount++;
          console.error(`Error copying document to collection ${collection.name}:`, error);

          // Delete the data from the collection that encountered the error
          await destinationCollection.deleteMany({});
          console.log(`Deleted data from collection ${collection.name} due to error`);
        }
      }
    }

    console.log('Data copied successfully');
    console.log('Successful copies:', successCount);
    console.log('Failed copies:', failureCount);
  } catch (error) {
    console.error('Error copying data:', error);
  } finally {
    await sourceClient.close();
    await destinationClient.close();
  }
}

copyData();


