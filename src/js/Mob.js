var _ = require('lodash');
var Bio = require('./Bio.js');

var Mob = module.exports = function (world, config) {
  Bio.call(this, world);
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Mob.prototype = Object.create(Bio.prototype);

Mob.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "bioConfig":
      Bio.prototype.parseConfig.call(this, val);
      break;
    }
  }, this);
};
