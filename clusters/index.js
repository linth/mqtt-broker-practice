/**
 * mqtt broker cluster with aedes.
 *  - 關掉mq, persistence.
 * 
 * TODO: add logging in aedes
 *  - https://www.npmjs.com/package/aedes-logging
 * 
 * TODO: add aedes-stats
 *  - https://www.npmjs.com/aedes-stats
 * 
 * 
 * Reference:
 *  - https://github.com/moscajs/aedes/tree/main/examples/clusters
 */

const cluster = require('cluster')
const Aedes = require('aedes')
const { createServer } = require('net')
const { cpus } = require('os')
// const MONGO_URL = 'mongodb://127.0.0.1/aedes-clusters'
const logger = require('./color')

// const mq = process.env.MQ === 'redis'
//   ? require('mqemitter-redis')({
//     port: process.env.REDIS_PORT || 6379
//   })
//   : require('mqemitter-mongodb')({
//     // url: MONGO_URL
//   })

// const persistence = process.env.PERSISTENCE === 'redis'
//   ? require('aedes-persistence-redis')({
//     port: process.env.REDIS_PORT || 6379
//   })
//   : require('aedes-persistence-mongodb')({
//     // url: MONGO_URL
//   })

logger.error("Error message");
logger.warn("Warning message");
logger.info("Info message");
logger.verbose("Verbose message");
logger.debug("Debug message");
logger.silly("Silly message");

function startAedes () {
  // mq?: any;
  // id?: string;
  // persistence?: any;
  // concurrency?: number;
  // heartbeatInterval?: number;
  // connectTimeout?: number;
  // queueLimit?: number;
  // maxClientsIdLength?: number;
  // preConnect?: PreConnectHandler;
  // authenticate?: AuthenticateHandler;
  // authorizePublish?: AuthorizePublishHandler;
  // authorizeSubscribe?: AuthorizeSubscribeHandler;
  // authorizeForward?: AuthorizeForwardHandler;
  // published?: PublishedHandler;

  const port = 1883

  const aedes = Aedes({
    id: 'BROKER_' + cluster.worker.id,
    // mq,
    // persistence
  })

  const server = createServer(aedes.handle)

  server.listen(port, '0.0.0.0', function () {
    // console.log('Aedes listening on port:', port)
    logger.info('Aedes listening on port:', port)
    aedes.publish({ topic: 'aedes/hello', payload: "I'm broker " + aedes.id })
  })

  server.on('error', function (err) {
    // console.log('Server error', err)
    logger.error('Server error', err)
    process.exit(1)
  })

  aedes.on('subscribe', function (subscriptions, client) {
    // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    //         '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
    logger.debug('MQTT client \x1b[32m' + (client ? client.id : client) +
      '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
  })

  aedes.on('unsubscribe', function (subscriptions, client) {
    // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    //         '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
    logger.debug('MQTT client \x1b[32m' + (client ? client.id : client) +
      '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
  })

  // fired when a client connects
  aedes.on('client', function (client) {
    // console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
    logger.info('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })

  // fired when a client disconnects
  aedes.on('clientDisconnect', function (client) {
    // console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
    logger.info('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })

  // fired when a message is published
  aedes.on('publish', async function (packet, client) {
    // console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
    logger.debug('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
  })
}

if (cluster.isMaster) {
  const numWorkers = cpus().length
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online')
  })

  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
    console.log('Starting a new worker')
    cluster.fork()
  })
} else {
  startAedes()
}