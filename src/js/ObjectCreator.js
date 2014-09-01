var Loader = require('./Loader.js');
var Conn = require('./Conn.js');
var Scene = require('./Scene.js');
var Account = require('./Account.js');
var Char = require('./Char.js');

var ObjectCreator = module.exports = function (world) {
  this.world = world;
};

ObjectCreator.prototype = {
  Loader: function() {
    return new Loader(this.world);
  },

  Conn: function(wsurl) {
    return new Conn(this.world, wsurl);
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

ObjectCreator.prototype.constructor = ObjectCreator;
