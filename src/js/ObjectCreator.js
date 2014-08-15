var Loader = require('./Loader.js');
var Conn = require('./Conn.js');
var Scene = require('./Scene.js');
var Account = require('./Account.js');
var Char = require('./Char.js');

var ObjectCreator = module.exports =  function (world) {
  this.world = world;
};

ObjectCreator.prototype = {
  Loader: function(option) {
    var loader = new Loader(option);
    loader.world = this.world;
    return loader;
  },

  Conn: function(wsurl, onmessage) {
    var conn = new Conn(wsurl, onmessage);
    conn.world = this.world;
    return conn;
  },

  Account: function(config) {
    return new Account(this.world, config);
  },

  Char: function(acc, config) {
    return new Char(acc, config);
  },

  Scene: function (config) {
    return new Scene(this.world, config);
  }
};
