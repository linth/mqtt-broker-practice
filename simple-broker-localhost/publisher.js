const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Publisher connected to MQTT broker');
  client.publish('myTopic', 'Hello, MQTT!');
  client.end();
});
