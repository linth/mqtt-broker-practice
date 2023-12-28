const mqtt = require('mqtt')

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = '/nodejs/mqtt'

// connect function.
client.on('connect', () => {
  console.log('Connected');

  // subscribue
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })

  // publish
  client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})

// receive message.
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})
