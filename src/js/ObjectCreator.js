var Loader = require('./Loader.js');
var Conn = require('./Conn.js');
var Scene = require('./Scene.js');
var Account = require('./Account.js');
var Char = require('./Char.js');
var Npc = require('./Npc.js');
var Equipment = require('./Equipment.js');
var UseSelfItem = require('./UseSelfItem.js');
var EtcItem = require('./EtcItem.js');

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

  Npc: function(config) {
    return new Npc(this.world, config);
  },

  Scene: function (config) {
    return new Scene(this.world, config);
  },

  Equipment: function (config) {
    return new Equipment(this.world, config);
  },

  UseSelfItem: function (config) {
    return new UseSelfItem(this.world, config);
  },

  EtcItem: function (config) {
    return new EtcItem(this.world, config);
  }
};

ObjectCreator.prototype.constructor = ObjectCreator;
