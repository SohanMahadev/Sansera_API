const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');
const express = require('express');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const cron = require('node-cron');

// Schema 
const batterySchema = new mongoose.Schema(
  {
    device: String,
    batteryPercentage: Number,
    unit_num: String,
    timestamp: { type: Number, default: Date.now }
  },
  { collection: 'percentage' }
);

const Battery = mongoose.model('Battery', batterySchema);

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

const devices = ['8BEBBFF643C6', 'C87BAAF79BEC', 'C50FC97C91E3', '2450378D18E9', '4D66CDFE31E7'];
const client = mqtt.connect(brokerUrl, login);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(subscribeTopic);

  // Sending initial battery status requests for all devices
  devices.forEach(device => {
    sendGetBatteryStatusMessage(device);
  });

  // Schedule cron job to send battery status requests every 2 minutes
  cron.schedule('*/2 * * * *', () => {
    devices.forEach(device => {
      sendGetBatteryStatusMessage(device);
    });
  });
});

client.on('message', (topic, message) => {
  if (topic === subscribeTopic) {
    const payload = JSON.parse(message.toString());
    const device = payload.devID;

    // Check if the received device is present in the devices array
    if (devices.includes(device)) {
      const batteryPercentage = payload.data;
      storeBatteryPercentage(device, batteryPercentage); ``
    } else {
      console.log(`Received data for unlisted device: ${device}. so lets ignore`);
    }
  }
});


async function storeBatteryPercentage(device, batteryPercentage) {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const document = new Battery({
      device: device,
      batteryPercentage: batteryPercentage,
      unit_num: 'U-1', // Assign unit_num to U-1
      timestamp: Date.now() // Epoch
    });
    await document.save();
    console.log(`Battery percentage for ${device} stored in the database.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}


function sendGetBatteryStatusMessage(device) {
  const message = JSON.stringify({ devID: device, data: 'GB' });
  client.publish(publishTopic, message);
  console.log(`GET_BAT_STS message sent for ${device}`);
}
