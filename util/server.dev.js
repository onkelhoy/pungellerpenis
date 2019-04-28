const https = require('https');
const fs = require('fs')
const path = require('path')

let privateKey = fs.readFileSync(path.resolve(__dirname, 'ssl/selfsigned.key'), 'utf8');
let certificate = fs.readFileSync(path.resolve(__dirname, 'ssl/selfsigned.crt'), 'utf8');

const credentials = {key: privateKey, cert: certificate};


module.exports = function (app) {
  const server = https.createServer(credentials, app)
  server.listen(process.env.PORT, u => console.log('[DEV]: listen on ' + process.env.PORT))
  return server 
}