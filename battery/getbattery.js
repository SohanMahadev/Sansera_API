/*const express = require('express');
const mqtt = require('mqtt');

const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const login = {
    username: 'mqtt',
    password: 'mqtt2022',
    clean: true,
    connectTimeout: 4000
  };

// MongoDB connection URI
const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/?retryWrites=true&w=majority';

// Middleware to parse JSON request body
app.use(express.json());

// API endpoint to get the latest battery status of all devices
app.get('/battery-status', async (req, res) => {
    try {
      // Connect to MongoDB Atlas
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to MongoDB Atlas');
  
      // Retrieve the latest battery status of all devices
      const database = client.db('status');
      const collection = database.collection('battery');
  


      const batteryStatus = await collection.aggregate([
        { $sort: { timestamp: -1 } }, // Sort by timestamp in descending order
        { $group: { _id: '$devID', latestData: { $first: '$data' } } }, // Group by devID and get the first (latest) data
        { $project: { _id: 0, devID: '$_id', data: '$latestData' } } // Project the result with desired field names
      ]).toArray();
  
      // Close the MongoDB connection
      await client.close();
  
      res.json(batteryStatus);
    } catch (error) {
      console.error('Error retrieving battery status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Function to publish 'GET_BAT_STS' message for each device with a 10-second interval
async function publishGetBatteryStatus(devices) {
  const client = mqtt.connect('mqtt://103.162.246.109:1883', login);

  for (const device of devices) {
    try {
      const message = {
        devID: device.devID,
        data: 'GET_BAT_STS'
      };

      client.publish('GET_BAT_STS', JSON.stringify(message));
      console.log(`Requested battery status for device ${device.devID}`);

      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (error) {
      console.error(`Error requesting battery status for device ${device.devID}:`, error);
    }
  }

  client.end();
}

// Array of devices
const devices = [
  { devID: '8BEBBFF643C6' },
  { devID: 'C87BAAF79BEC' },
  { devID: 'C50FC97C91E3' },
  { devID: '2450378D18E9' },
  { devID: '4D66CDFE31E7' }
];

// Start publishing 'GET_BAT_STS' messages for each device
publishGetBatteryStatus(devices).catch(console.error);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/?retryWrites=true&w=majority';

// Middleware to parse JSON request body
app.use(express.json());

// API endpoint to get the latest battery status of all devices
app.get('/battery-status', async (req, res) => {
  try {
    // Connect to MongoDB Atlas
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Retrieve the latest battery status of all devices
    const database = client.db('status');
    const collection = database.collection('battery');

    const batteryStatus = await collection.aggregate([
      { $sort: { timestamp: -1 } }, // Sort by timestamp in descending order
      { $group: { _id: '$devID', latestData: { $first: '$data' } } }, // Group by devID and get the first (latest) data
      { $project: { _id: 0, devID: '$_id', data: '$latestData' } } // Project the result with desired field names
    ]).toArray();

    // Close the MongoDB connection
    await client.close();

    res.json(batteryStatus);
  } catch (error) {
    console.error('Error retrieving battery status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
