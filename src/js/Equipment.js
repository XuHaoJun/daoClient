var _ = require('lodash');
var Item = require('./Item.js');

var Equipment = module.exports = function (world, config) {
  Item.call(this, world);
  this.equipLimit = null;
  this.bonusInfo = null;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Equipment.prototype = Object.create(Item.prototype);

Equipment.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "itemConfig":
      Item.prototype.parseConfig.call(this, val);
      break;
    case "equipLimit":
    case "equipViewId":
    case "bonusInfo":
      this[key] = val;
      break;
    }
  }, this);
};

// TODO
// send request equip self to the sever
Equipment.prototype.handleClick = function(event) {
  if (_.isObject(this.owner)) {
    if (_.indexOf(this.owner.usingEquips, this) == -1) {
      this.owner.equipBySlot(this);
    } else {
      this.owner.unequipBySlot(this);
    }
  }
};
