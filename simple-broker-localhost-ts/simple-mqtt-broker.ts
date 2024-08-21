import Aedes from 'aedes'
import { createServer } from 'net'

const port = 1883

const aedes = new Aedes()
const server = createServer(aedes.handle)

aedes.authenticate = function authenticate(client, username, password, callback) {
  /**
   * 
   * - client: <Client>, can use client parm. to get client's information.
   * - username: <string>
   * - password: <Buffer>
   * - callback: <Function> (error, successful) => void
   *  - error <Error> | null
   *  - successful <boolean>
   */
  console.log('call authenticate');
	
  if (username === 'george' && password?.toString() === '123') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

server.listen(port, function () {
  console.log('server started and listening on port ', port)
});
