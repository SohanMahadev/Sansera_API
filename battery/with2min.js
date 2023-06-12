/*const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');


const login = {
  username: 'mqtt',
  password: 'mqtt2022',
  clean: true,
  connectTimeout: 4000
};

const brokerUrl = 'mqtt://103.162.246.109:1883';

const publishTopic = 'GET_BAT_STS';
const subscribeTopic = 'BAT_STS';

const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/status?retryWrites=true&w=majority';

const dbName = 'battery';
const collectionName = 'percentage';

const devices = ['8BEBBFF643C6', 'C87BAAF79BEC', 'C50FC97C91E3', '2450378D18E9', '4D66CDFE31E7'];

const client = mqtt.connect(brokerUrl,login);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(subscribeTopic);
  devices.forEach(device => {
    sendGetBatteryStatusMessage(device);
  });
});

client.on('message', (topic, message) => {
  if (topic === subscribeTopic) {
    const payload = JSON.parse(message.toString());
    const device = payload.devID;
    const batteryPercentage = payload.data;
    storeBatteryPercentage(device, batteryPercentage);
  }
});

async function storeBatteryPercentage(device, batteryPercentage) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const document = {
      device: device,
      batteryPercentage: batteryPercentage,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    
    await collection.insertOne(document);
    console.log(`Battery percentage for ${device} stored in the database with IST timestamp.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

function sendGetBatteryStatusMessage(device) {
  const batteryPercentage = Math.floor(Math.random() * 101);
  const message = JSON.stringify({ devID: device, data: 'GB' });
  client.publish(publishTopic, message);
  console.log(`GET_BAT_STS message sent for ${device}`);

  
  setTimeout(() => {
    const responseMessage = JSON.stringify({ devID: device, data: batteryPercentage.toString() });
    client.publish(subscribeTopic, responseMessage);
    console.log(`Response message sent for ${device} with battery percentage ${batteryPercentage}`);
  }, 10000); 
}*/

const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');

const login = {
  username: 'mqtt',
  password: 'mqtt2022',
  clean: true,
  connectTimeout: 4000
};

const brokerUrl = 'mqtt://103.162.246.109:1883';

const publishTopic = 'GET_BAT_STS';
const subscribeTopic = 'BAT_STS';

const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/battery?retryWrites=true&w=majority';

const dbName = 'battery';
const collectionName = 'percentage';

const devices = ['8BEBBFF643C6', 'C87BAAF79BEC', 'C50FC97C91E3', '2450378D18E9', '4D66CDFE31E7'];

const client = mqtt.connect(brokerUrl, login);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(subscribeTopic);
});

client.on('message', (topic, message) => {
  if (topic === subscribeTopic) {
    const payload = JSON.parse(message.toString());
    const device = payload.devID;
    const batteryPercentage = payload.data;
    storeBatteryPercentage(device, batteryPercentage);
  }
});

async function storeBatteryPercentage(device, batteryPercentage) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const document = {
      device: device,
      batteryPercentage: batteryPercentage,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    await collection.insertOne(document);
    console.log(`Battery percentage for ${device} stored in the database with IST timestamp.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

function sendGetBatteryStatusMessage(device) {
  const batteryPercentage = Math.floor(Math.random() * 101);
  const message = JSON.stringify({ devID: device, data: 'GB' });
  client.publish(publishTopic, message);
  console.log(`GET_BAT_STS message sent for ${device}`);

  setTimeout(() => {
    const responseMessage = JSON.stringify({ devID: device, data: batteryPercentage.toString() });
    client.publish(subscribeTopic, responseMessage);
    console.log(`Response message sent for ${device} with battery percentage ${batteryPercentage}`);
  }, 10000);
}

// Schedule the script to run every 2 minutes
cron.schedule('*/2 * * * *', () => {
  devices.forEach(device => {
    sendGetBatteryStatusMessage(device);
  });
});

// Connect to MQTT broker
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// Handle MQTT message received
client.on('message', (topic, message) => {
  if (topic === subscribeTopic) {
    const payload = JSON.parse(message.toString());
    const device = payload.devID;
    const batteryPercentage = payload.data;
    storeBatteryPercentage(device, batteryPercentage);
  }
});
