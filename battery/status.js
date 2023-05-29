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

publishMessages().catch(console.error);
