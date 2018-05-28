var http = require('http');
var axios = require('axios');

var methods = http.METHODS.map(m => m.toLowerCase());

function Speconnect(server) {
  this._server = server;
  this.port = server.address().port;
  this.address = server.address().address;
  this.protocol = 'http://';
  this.url = this.protocol + this.address + ':' + this.port;

  var that = this;

  // add axios methods
  methods.forEach(function(method) {

    that[method] = function(path, opt) {

      var options = Object.assign({}, opt, {
        method: method,
        url: that.url + path
      });

      return axios(options);
    };
  });

}

Speconnect.prototype.close = function (done) {

  if (typeof done === 'function') {
    return this._server.close(done);
  }

  var that = this;

  return new Promise(function(res, rej) {
    that._server.close(function(err) {
      if (err) return rej(err);
      return res();
    })
  });
}

function tryListen(server, res, rej) {

  server.listen(0, '127.0.0.1');

  server.once('listening', function() {
    if (!rej) return res(null, new Speconnect(server));
    return res(new Speconnect(server));
  });

  server.once('error', function(err) {
    if(!rej) return res(err, null);
    return rej(err);
  });
}

module.exports = function(server, cb) {

  // server is connect middleware
  if (!(server instanceof http.Server)) {
    server = http.createServer(server);
  }

  if (typeof cb === 'function') {
    return tryListen(server, cb, null);
  }

  return new Promise(function(res, rej) {
    tryListen(server, res, rej);
  });
}
