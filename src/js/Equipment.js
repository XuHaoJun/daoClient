var _ = require('lodash');
var Item = require('./Item.js');

var Equipment = module.exports = function (world, config) {
  Item.call(this, world);
  this.equipLimit = null;
  this.bonusInfo = null;
  this.level = 1;
  this.on("click", this.handleEquipClick);
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
    case "level":
      this[key] = val;
      break;
    }
  }, this);
};

// TODO
// send request equip self to the sever
Equipment.prototype.handleEquipClick = function(event, viewName) {
  if (_.isObject(this.owner) &&
      (viewName == "CharItems" || viewName == "CharUsingEquips" ||
       viewName == "CharHotKeys")) {
    if (_.indexOf(this.owner.usingEquips, this) == -1) {
      this.owner.equipBySlot(this);
    } else {
      this.owner.unequipBySlot(this);
    }
  }
};
