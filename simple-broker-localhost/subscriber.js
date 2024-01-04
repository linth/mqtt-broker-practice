const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Subscriber connected to MQTT broker');
  
  client.subscribe('myTopic', (err) => {
    if (!err) {
      console.log('Subscriber subscribed to myTopic');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message.toString()}`);
  client.end();
});
