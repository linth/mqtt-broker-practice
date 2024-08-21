const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

function authenticate(client, username, password, callback) {
  /**
   * 
   * - client: <Client>, can use client parm. to get client's information.
   * - username: <string>
   * - password: <Buffer>
   * - callback: <Function> (error, successful) => void
   *  - error <Error> | null
   *  - successful <boolean>
   */
  if (username === 'george' && password.toString() === '123') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

function authorizePublish(client, packet, callback) {
  // 判斷publish topic正確性
  /**
   * Invoked when
   *  - publish LWT to all online clients
   *  - incoming client publish
   * 
   * - client: <Client> | null 
   * - packet: <object> PUBLISH 
   * - callback: <Function> (error) => void 
   *  - error <Error> | null
   */
  if (packet.topic === 'aaaa') {
    console.log('get packet topic aaaa'); 
    return callback(new Error('wrong topic'))
  }
  if (packet.topic === 'bbb') {
    console.log('get packet topic bbb');  
    packet.payload = Buffer.from('overwrite packet payload')
  }
  callback(null)
}

function authorizeSubscribe(client, sub, callback) {
  /**
   * 
   * Invoked when
   *  - restore subscriptions in non-clean session.
   *  - incoming client SUBSCRIBE
   */
  if (sub.topic === 'aaaa') {
    console.log('get packet topic aaaa'); 
    return callback(new Error('wrong topic'))
  }
  if (sub.topic === 'bbb') {
    console.log('get packet topic bbb');  
    // overwrites subscription
    sub.topic = 'foo'
    sub.qos = 1
  }
  callback(null, sub)
}

function authorizeForward(client, packet) {
  // ??? cannot understand.
  /**
   * Invoked when
   *  - aedes sends retained messages when client reconnects
   *  - aedes pre-delivers subscribed message to clients
   * 
   * client: <Client> 
   * packet: <aedes-packet> & PUBLISH
   * Returns: <aedes-packet> | null
   */
  console.log('call authorizeForward');
  
  if (packet.topic === 'aaaa' && client.id === "I should not see this") {
    console.log('packet topic is aaaa, and client id is "I should not see this".');
    return 
  }
  if (packet.topic === 'bbb') {
    console.log('get packet topic bbb');
    packet.payload = new Buffer('overwrite packet payload')
  }
  return packet
}

function published (packet, client, callback) {
  /**
   * same as Event: publish
   * If you are doing operations on packets that MUST require finishing operations on a packet before handling the next one use this otherwise
   * 
   * - packet: <aedes-packet> & PUBLISH
   * - client: <Client>
   * - callback: <Function>
   */
  console.log('call published');  
}

// set up aedes.
aedes.authenticate = authenticate;
aedes.authorizePublish = authorizePublish;
aedes.authorizeSubscribe = authorizeSubscribe;
// aedes.authorizeForward = authorizeForward;
// aedes.published = published;

server.listen(port, () => {
  console.log('server started and listening on port ', port);  
});


// access the broker ID
console.log(`aedes broker ID: ${aedes.id}`);

// Listen for new client connections (連線)
aedes.on('client', function (client) {
  console.log(`Client connected: ${client.id}`);
  console.log(`Connected Clients: ${aedes.connectedClients}`);
});

// Listen for client disconnect events (斷線)
aedes.on('clientDisconnect', function (client) {
  console.log(`Client disconnected: ${client.id}`);
  console.log(`Connected Clients: ${aedes.connectedClients}`);
});

// Handle messages (publish資料)
aedes.on('publish', function (packet, client) {
  if (client) {
    console.log(`Message from ${client.id}: ${packet.payload.toString()}`);
  }
});

// Handle disconnection errors (連線錯誤)
aedes.on('connectionError', (client, error) => {
  console.error(`Connection error from ${client.id}: ${error.message}`);  
});

// Handle keep-alive timeout
aedes.on('keepaliveTimeout', function (client) {
  console.log(`Client ${client.id} has exceeded keep-alive timeout.`);
  // Optionally disconnect the client
  client.close();
});

// Handle message acknowledgment (QoS 1 or 2)
aedes.on('ack', function (packet, client) {
  if (client) {
    console.log(`Message acknowledged by client ${client.id}: ${packet.messageId}`);
  }
});

// Handle ping requests (keep-alive mechanism)
aedes.on('ping', function (client) {
  console.log(`Ping received from client ${client.id}`);
});

// Handle subscription events
aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log(`Client ${client.id} subscribed to topics: ${subscriptions.map(sub => sub.topic).join(', ')}`);
  }
});
