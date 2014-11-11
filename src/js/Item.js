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
  this.buyPrice = 0;
  this.sellPrice = 0;
  this.icon = null;
  this.owner = null;
  this.domLabel = null;
  this.slotIndex = -1;
  this.on("click", this.handleShopClick);
  this.on("click", this.handleSellClick);
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
    case "buyPrice":
    case "sellPrice":
      this[key] = val;
      break;
    case "cpBody":
      this.cpBody = parseClient.cpBody(val);
      break;
    default:
      console.log("unknown config: ", key, val);
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
    this.icon = this.world.assets.itemIcon[this.iconViewId];
  }
};

Item.prototype.handleShopClick = function(event, viewName) {
  if (viewName != "Shop" || !_.isNumber(this.shopIndex)) {
    return;
  }
  var char = this.world.account.usingChar;
  char.buyItemFromOpeningShop(this.shopIndex);
};

Item.prototype.handleSellClick = function(event, viewName) {
  if (viewName != "CharItems" || event.ctrlKey == false) {
    return;
  }
  var char = this.world.account.usingChar;
  char.sellItemToOpeningShop(this.baseId, this.slotIndex);
};

Item.prototype.handleUpdateConfig = function(config) {
  _.each(config, function(val, key) {
    this[key] = val;
  }, this);
};

Item.prototype.genDomLabel = function(pos) {
  var element	= document.createElement('div');
  element.className = "dao-item-label";
  element.innerHTML = this.name;
  element.style.left = pos.x+'px';
  element.style.top = pos.y+'px';
  return element;
};

Item.prototype.updateDomLabel = function(pos) {
  this.domLabel.style.left = pos.x+'px';
  this.domLabel.style.top = pos.y+'px';
};
