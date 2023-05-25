
const mqtt = require('mqtt');
const fs = require('fs');
const moment = require('moment');

const options = {
  username: 'mqtt',
  password: 'mqtt2022'
};

const client = mqtt.connect('mqtt://103.162.246.109:1883', options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('first-topic');
  client.subscribe('second-topic');
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message.toString()}`);

  if (topic === 'second-topic') {
    const data = JSON.parse(message.toString());
    logData(data);
  }
});

async function publishMessages() {
  for (let i = 0; i < 3; i++) {
    const message = { sohan: i };
    client.publish('first-topic', JSON.stringify(message));
    console.log(`Published message ${JSON.stringify(message)} to "first-topic"`);
    await sleep(2000);
  }

  const switchMessage = { message: 'Going to the second topic' };
  client.publish('second-topic', JSON.stringify(switchMessage));
  console.log(`Published switch message "${switchMessage.message}" to "second-topic"`);
}

function logData(data) {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const logEntry = `${timestamp}: ${JSON.stringify(data)}\n`;

  fs.access('mqtt_log.txt', fs.constants.F_OK, (err) => {
    if (err) {
     
      fs.writeFile('mqtt_log.txt', logEntry, (err) => {
        if (err) {
          console.error('Failed to create log file:', err);
        } else {
          console.log(`Created log file and logged data: ${logEntry}`);
        }
      });
    } else {
      
      fs.appendFile('mqtt_log.txt', logEntry, (err) => {
        if (err) {
          console.error('Failed to write to log file:', err);
        } else {
          console.log(`Logged data to file: ${logEntry}`);
        }
      });
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

publishMessages();
