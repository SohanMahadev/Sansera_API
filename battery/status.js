/*const mqtt = require('mqtt');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const login = {
  username: 'mqtt',
  password: 'mqtt2022',
  clean: true,
  connectTimeout: 4000
};

const client = mqtt.connect('mqtt://103.162.246.109:1883', login);
console.log('Connected to MQTT broker');

//subcribing to mqqtt topic

client.on('message', (topic, message) => {
  console.log(topic, message.toString());
  if (topic === 'BAT_STS') {
    console.log(message.toString());
    fs.appendFileSync('./BATTERY_STATUS.txt', `${Date()}:${message.toString()}\n`);
  }
});

async function insertBatteryStatus(devID, data) {
  const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db('status');
    const collection = database.collection('battery');

    const batteryStatus = {
      devID,
      data,
      timestamp: new Date()
    };

    await collection.insertOne(batteryStatus);
    console.log('Battery status inserted into MongoDB.');
  } catch (error) {
    console.error('Error inserting battery status:', error);
  } finally {
    await client.close();
  }
}

async function publishMessages() {
  let counter = 0;
  client.subscribe('BAT_STS');

  while (true) {
    let message = {
      devID: '8BEBBFF643C6',
      data: 'LG 1,1'
    };

    try {
      client.publish('LED_GLOW', JSON.stringify(message));
      console.log(`Published message ${JSON.stringify(message)} to "LED_GLOW"`);
      await new Promise(r => setTimeout(r, 3000));
      counter++;
      

      if (counter % 3 === 0) {
        let batteryStatusMessage = {

          devID: '8BEBBFF643C6',
          data: '95%'
        };

        client.publish('GET_BAT_STS', JSON.stringify(batteryStatusMessage));
        console.log('Requested battery status');

        await new Promise(r => setTimeout(r, 500)); // Wait for battery status to be received

        insertBatteryStatus(batteryStatusMessage.devID, batteryStatusMessage.data);
      }
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }
}

publishMessages().catch(console.error);*/


//git

const mqtt = require('mqtt');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const login = {
  username: 'mqtt',
  password: 'mqtt2022',
  clean: true,
  connectTimeout: 4000
};

const client = mqtt.connect('mqtt://103.162.246.109:1883', login);
console.log('Connected to MQTT broker');

// Subscribing to MQTT topic
client.on('message', (topic, message) => {
  console.log(topic, message.toString());
  if (topic === 'BAT_STS') {
    console.log(message.toString());
    fs.appendFileSync('./BATTERY_STATUS.txt', `${Date()}:${message.toString()}\n`);
  }
});

async function insertBatteryStatus(devID, data) {
  const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db('status');
    const collection = database.collection('battery');

    const batteryStatus = {
      devID,
      data,
      timestamp: new Date()
    };

    await collection.insertOne(batteryStatus);
    console.log('Battery status inserted into MongoDB.');
  } catch (error) {
    console.error('Error inserting battery status:', error);
  } finally {
    await client.close();
  }
}

async function publishMessages() {
  const devices = [
    { devID: '8BEBBFF643C6', data: 'LG 1,1' },
    { devID: 'C87BAAF79BEC', data: 'LG 1,2' },
    { devID: 'C50FC97C91E3', data: 'LG 1,3' },
    { devID: '2450378D18E9', data: 'LG 1,4' },
    { devID: '4D66CDFE31E7', data: 'LG 1,5' }
  ];

  let counter = 0;
  client.subscribe('BAT_STS');

  while (true) {
    const message = devices[counter % devices.length];

    try {
     
      await new Promise((r) => setTimeout(r, 3000));
      counter++;

      if (counter % 5 === 0) {
        const batteryStatusMessage = {
          devID: message.devID,
          data: '90%'
        };

        client.publish('GET_BAT_STS', JSON.stringify(batteryStatusMessage));
        console.log('Requested battery status');

        await new Promise((r) => setTimeout(r, 10000)); // Wait for battery status to be received

        insertBatteryStatus(batteryStatusMessage.devID, batteryStatusMessage.data);
      }
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }
}

publishMessages().catch(console.error);

