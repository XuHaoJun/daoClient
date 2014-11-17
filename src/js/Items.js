var _ = require('lodash');
var EtcItem = require('./EtcItem.js');
var UseSelfItem = require('./UseSelfItem.js');
var Equipment = require('./Equipment.js');

var Items = module.exports = function (world, config) {
  this.world = world;
  this.useSelfItem = new Array(30);
  this.equipment = new Array(30);
  this.etcItem = new Array(30);
  this.updateId = 0;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

Items.prototype.parseConfig = function(config) {
  _.each(config, function(val, itemType) {
    this[itemType] = [];
    _.each(val, function(itemConfig, slotIndex) {
      if (itemConfig) {
        var item = this.world.create[capitalize(itemType)](itemConfig);
        item.slotIndex = slotIndex;
        this[itemType].push(item);
      } else {
        this[itemType].push(null);
      }
    }, this);

    // switch (key) {
    // case "useSelfItem":
    //   this.useSelfItem = [];
    //   _.each(val, function(item) {
    //     if (item) {
    //       this.useSelfItem.push(new UseSelfItem(this.world, item));
    //     } else {
    //       this.useSelfItem.push(null);
    //     }
    //   }, this);
    //   break;
    // case "equipment":
    //   this.equipment = [];
    //   _.each(val, function(item) {
    //     if (item) {
    //     this.equipment.push(new Equipment(this.world, item));
    //     } else {
    //       this.equipment.push(null);
    //     }
    //   }, this);
    //   break;
    // case "etcItem":
    //   this.etcItem = [];
    //   _.each(val, function(item) {
    //     if (item) {
    //       this.etcItem.push(new EtcItem(this.world, item));
    //     } else {
    //       this.etcItem.push(null);
    //     }
    //   }, this);
    //   break;
    // }
  }, this);
};

// TODO
// may be add an owner arg for constructor
Items.prototype.setAllOwner = function(owner) {
  var itemsType = ['useSelfItem', 'equipment', 'etcItem'];
  _.each(itemsType, function(isType) {
    _.each(this[isType], function(item) {
      if (item) {
        item.owner = owner;
      }
    }, this);
  }, this);
};
