var _ = require('lodash');
var Equipment = require('./Equipment.js');

var UsingEquips = module.exports = function (world, config) {
  this.world = world;
  this.equipment = new Array(12);
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

UsingEquips.prototype = new Array(12);

UsingEquips.prototype.parseConfig = function(config) {
  _.each(config, function(eqConfig, index) {
    if (eqConfig) {
      this[index] = new Equipment(this.world, eqConfig);
    } else {
      this[index] = null;
    }
  }, this);
};

// TODO
// may be add an owner arg for constructor
UsingEquips.prototype.setAllOwner = function(owner) {
  _.each(this, function(eq) {
    if (eq) {
      eq.owner = owner;
    }
  });
};

module.exports.hashNumber = _.range(12);

module.exports.hashEnName = ['leftHand',
                             'rightHand',
                             'head',
                             'shoulders',
                             'torso',
                             'wrists',
                             'hands',
                             'waist',
                             'legs',
                             'leftFinger',
                             'rightFinger',
                             'neck'];

module.exports.hashTwName = ['副手',
                             '主手',
                             '頭盔',
                             '護肩',
                             '盔甲',
                             '護手',
                             '手套',
                             '腰帶',
                             '護腿',
                             '戒指',
                             '戒指',
                             '項鍊'];

var aryGet = _.zipObject(['leftHand',
                          'rightHand',
                          'head',
                          'shoulders',
                          'torso',
                          'wrists',
                          'hands',
                          'waist',
                          'legs',
                          'leftFinger',
                          'rightFinger',
                          'neck'], _.range(12));

_.each(aryGet, function(val, key) {
  Object.defineProperty(UsingEquips.prototype, key, {
    get: function () {
      return this[val];
    },
    set: function (v) {
      this[val] = v;
    }
  });
});
