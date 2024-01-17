const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

function authenticate(client, username, password, callback) {
  if (username === 'george' && password.toString() === '123') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

aedes.authenticate = authenticate;

server.listen(port, () => {
  console.log('server started and listening on port ', port)
})