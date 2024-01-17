const mqtt = require('mqtt');
const { error } = require('winston');
const { cli } = require('winston/lib/winston/config');

// add authenticate.
const client = mqtt.connect('mqtt://localhost:1883', {
  username: 'george',
  password: '123'
});

client.on('connect', () => {
  // client connect to mqtt broker.
  console.log('Subscriber connected to MQTT broker');
  
  // client subscribe topics.
  client.subscribe('myTopic', (err) => {
    if (!err) {
      console.log('Subscriber subscribed to myTopic');
    }
  });
});

// 當收到 message 時候觸發
client.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message.toString()}`);
  client.end();
});
