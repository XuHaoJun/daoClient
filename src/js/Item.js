var _ = require('lodash');
var $ = require('jquery/dist/jquery');
var parseClient = require('./util/parseClient.js');
var SceneObject = require('./SceneObject.js');
var TextSprite = require('./TextSprite.js');
var work = require('webworkify');
var screenXYWorker = work(require('./ScreenXYWorker.js'));

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
  this.owner = null;
  this.domLabel = null;
  this.spriteLabel = null;
  this.slotIndex = -1;
  this.updateId = 0;
  this.icon = null;
  this.on("click", this.handleShopClick);
  this.on("click", this.handleSellClick);
  screenXYWorker.addEventListener('message', function(event) {
    if (this.domLabel && this.id == event.data.id) {
      this.domLabel.style.left = event.data.x+'px';
      this.domLabel.style.top = event.data.y+'px';
    }
  }.bind(this));
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

Item.prototype.genSpriteLabel = function() {
  var text = new TextSprite(this.name, {fontsize: 30,
                                        fontface: "Georgia",
                                        borderColor: {r:0, g:0, b:255, a:0.8} });
  text.threeBody.scale.set(180, 80, 1.0);
  text.threeBody.userData = this;
  text.on("click", function(event) {
    event.preventDefault();
    var char = this.world.account.usingChar;
    char.tryPickItem(this);
  }.bind(this));
  text.on("mouseenter", function(event) {
    text.setBackgroundColor({r:99, g:99, b:99, a:1.0});
  });
  text.on("mouseleave", function(event) {
    text.setBackgroundColor({ r:255, g:255, b:255, a:1.0 });
  });
  return text;
};

Item.prototype.updateSpriteLabel = function() {
  if (this.spriteLabel) {
    var position = this.threeBody.position;
    this.spriteLabel.threeBody.position.set(position.x, position.y, position.z + 10);
  }
};

Item.prototype.genDomLabel = function() {
  var element   = document.createElement('div');
  element.className = "dao-item-label";
  element.innerHTML = this.name;
  $(element).on('click', function(event) {
    event.preventDefault();
    var char = this.world.account.usingChar;
    char.tryPickItem(this);
  }.bind(this));
  return element;
};

Item.prototype.updateDomLabel = function(camera) {
  var width = window.innerWidth, height = window.innerHeight;
  screenXYWorker.postMessage({
    id: this.id,
    width: width,
    height: height,
    camera: {projectionMatrix: camera.projectionMatrix,
             matrixWorld: camera.matrixWorld},
    matrixWorld: this.threeBody.matrixWorld
  });
};
