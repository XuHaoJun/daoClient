var _ = require('lodash');
var parseClient = require('./util/parseClient.js');
var SceneObject = require('./SceneObject.js');

var Item = module.exports = function (world, config) {
  SceneObject.call(this);
  this.world = world;
  this.baseId = 0;
  this.name = '';
  this.ageisName = '';
  this.iconViewId = 0;
  this.bodyViewId = 0;
  this.icon = null;
  this.owner = null;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Item.prototype = Object.create(SceneObject.prototype);

Item.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "id":
    case "baseId":
    case "name":
    case "ageisName":
    case "iconViewId":
    case "bodyViewId":
      this[key] = val;
      break;
    case "cpBody":
      this.cpBody = parseClient.cpBody(val);
      break;
    default:
      console.log("unknown config");
      break;
    }
  }, this);
  if (_.isNumber(config.bodyViewId)) {
    this.threeBody = this.world.assets.mesh[this.bodyViewId].clone();
    this.threeBody.userData = this;
    this.syncRotation();
    this.syncCpAndThree();
  }
  if (_.isNumber(config.iconViewId)) {
    this.icon = this.world.assets.icon[this.iconViewId];
  }
};
