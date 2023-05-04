const mqtt = require('mqtt');

const options = {
    username: 'mqtt',
    password: 'mqtt2022'
  };
const client = mqtt.connect('mqtt://203.129.243.94:1883',options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('SWITCH_PRESS');



client.publish('SWITCH_PRESS', message, (err) => {
      if (err) {
        console.error(`Failed to publish message: ${err}`);
      } else {
        console.log("one")
        console.log(` "${message}" `);
      }
    });
});



client.on('message', (topic,message) => {
    console.log("this is meesage ")
  console.log(message.toString());
  
});
const message = "qwert";
    

    

//const message = JSON.stringify(data);










