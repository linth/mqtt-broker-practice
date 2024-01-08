const fs = require('fs')
// const logger = require('mqtt-over-tls/')

const aedes = require('aedes')()
const port = 8883

const options = {
  // key: fs.readFileSync('YOUR_PRIVATE_KEY_FILE.pem'),
  // cert: fs.readFileSync('YOUR_PUBLIC_CERT_FILE.pem')
}

const server = require('tls').createServer(options, aedes.handle)

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})