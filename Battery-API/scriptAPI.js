const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');
const express = require('express');
const moment = require('moment-timezone');

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
const client = mqtt.connect(brokerUrl, login);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(subscribeTopic);
  devices.forEach(device => {
    sendGetBatteryStatusMessage(device);
  });

  //sending battery status request every 2 minutes
  
  setInterval(() => {
    devices.forEach(device => {
      sendGetBatteryStatusMessage(device);
    });
  }, 2 * 60 * 1000); 
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
      timestamp: new Date().getTime() // epoch
    };

    await collection.insertOne(document);
    console.log(`Battery percentage for ${device} stored in the database with epoch timestamp.`);
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

// API and SERVER setup.
const app = express();
const port = 3000;

app.get('/battery-status', async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const latestBatteryStatus = await collection.find().sort({ _id: -1 }).limit(devices.length).toArray();

    const batteryStatusIST = latestBatteryStatus.map(status => ({
      device: status.device,
      batteryPercentage: status.batteryPercentage,
      timestamp: convertEpochToIST(status.timestamp)
    }));

    res.json(batteryStatusIST);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.close();
  }
});
//converting Epoch to IST to get the response in IST after API call
function convertEpochToIST(epochTimestamp) {
  const date = new Date(epochTimestamp);
  const istTimestamp = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return istTimestamp;
}



app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
