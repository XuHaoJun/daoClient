var _ = require('lodash');
var parseClient = require('../util/parseClient.js');
var SceneObject = require('../SceneObject.js');

var Cleave = module.exports = function (world, config) {
  SceneObject.call(this);
  this.world = world;
  this.level = 0;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Cleave.prototype = Object.create(SceneObject.prototype);

Cleave.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "id":
    case "bodyViewId":
    case "level":
      this[key] = val;
      break;
    case "cpBody":
      this.cpBody = parseClient.cpBody(val);
      break;
    default:
      console.log("unknown bio config ", "key: ", key, "val: ", val);
      break;
    }
  }, this);
  if (_.isNumber(config.bodyViewId) &&
      config.bodyViewId >= 0) {
    this.threeBody = this.world.assets.mesh[this.bodyViewId].clone();
    this.threeBody.userData = this;
    // this.setDefaultGlowEffect();
    this.syncCpAndThree();
    this.syncRotation();
  }
};
