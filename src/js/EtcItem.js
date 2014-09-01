var _ = require('lodash');
var Item = require('./Item.js');

var EtcItem = module.exports = function (world, config) {
  Item.call(this, world);
  this.stackCount = 0;
  this.maxStackCount = 0;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

EtcItem.prototype = Object.create(Item.prototype);

EtcItem.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "itemConfig":
      Item.prototype.parseConfig.call(this, val);
      break;
    case "stackCount":
    case "maxStackcount":
      this[key] = val;
      break;
    }
  }, this);
};
