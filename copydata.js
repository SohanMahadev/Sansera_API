/*const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/sansera?retryWrites=true&w=majority';
const dbName = 'sansera';

async function listCollections() {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    const database = client.db(dbName);
    const collectionNames = await database.listCollections().toArray();

    // Sort collection names alphabetically
    collectionNames.sort((a, b) => a.name.localeCompare(b.name));

    for (const collection of collectionNames) {
      console.log(collection.name);
    }
  } catch (error) {
    console.error('Error listing collections:', error);
  } finally {
    await client.close();
  }
}

listCollections();


listCollections();*/

/*const { MongoClient } = require('mongodb');

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

    const collectionsCursor = await sourceDB.listCollections({}, { nameOnly: true });
    const collections = await collectionsCursor.toArray();
    collections.sort((a, b) => a.name.localeCompare(b.name)); // Sort the collections alphabetically

    let successCount = 0;
    let failureCount = 0;
    let deletedCollections = [];

    for (const collection of collections) {
      const sourceCollection = sourceDB.collection(collection.name);
      const destinationCollection = destinationDB.collection(collection.name);

      await destinationCollection.deleteMany({});

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

          await destinationCollection.deleteMany({});
          console.log(`Deleted data from collection ${collection.name} due to error`);
          deletedCollections.push(collection.name);
          break;
        }
      }
    }

    console.log('Data copied successfully');
    console.log('Successful copies:', successCount);
    console.log('Failed copies:', failureCount);

    if (deletedCollections.length > 0) {
      console.log('Collections where data is deleted:', deletedCollections.join(', '));
    }
  } catch (error) {
    console.error('Error copying data:', error);
  } finally {
    await sourceClient.close();
    await destinationClient.close();
  }
}

copyData();*/


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

    const collectionsCursor = await sourceDB.listCollections({}, { nameOnly: true });
    const collections = await collectionsCursor.toArray();

    let successCount = 0;
    let failureCount = 0;
    let deletedCollections = [];

    for (const collection of collections) {
      const sourceCollection = sourceDB.collection(collection.name);
      const destinationCollection = destinationDB.collection(collection.name);

      await destinationCollection.deleteMany({});

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

          await destinationCollection.deleteMany({});
          console.log(`Deleted data from collection ${collection.name} due to error`);
          deletedCollections.push(collection.name);
          break;
        }
      }
    }

    console.log('Data copied successfully');
    console.log('Successful copies:', successCount);
    console.log('Failed copies:', failureCount);

    if (deletedCollections.length > 0) {
      console.log('Collections where data is deleted:', deletedCollections.join(', '));
    }
  } catch (error) {
    console.error('Error copying data:', error);
  } finally {
    await sourceClient.close();
    await destinationClient.close();
  }
}

copyData();


