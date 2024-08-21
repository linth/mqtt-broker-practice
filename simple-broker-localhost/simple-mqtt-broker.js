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
  console.log('server started and listening on port ', port)
})