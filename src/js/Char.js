var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var THREE = require('three');
var Items = require('./Items.js');
var UsingEquips = require('./UsingEquips.js');
var Bio = require('./Bio.js');
var Npc = require('./Npc.js');
var Account = require('./Account.js');

var Char = module.exports = function (account, config) {
  Bio.call(this, account.world);
  this.create = account.world.create;
  this.account = account;
  this.slotIndex = 0;
  this.items = {useSelfItem: new Array(30),
                equipment: new Array(30),
                etcItem: new Array(30)};
  this.lastSceneName = '';
  this.lastX = 0;
  this.lastY = 0;
  this.lastClientX = 0;
  this.lastClientY = 0;
  this.lastMiniTarget = null;
  this.lastRequestId = null;
  this.dzeny = 0;
  this.buttons = {canvas: {mouse: {isDowning: false,
                                   isUping: false,
                                   isHovering: true,
                                   isMoving: false}}};
  this.draggingItem = null;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Char.prototype = Object.create(Bio.prototype);

Char.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "bioConfig":
      Bio.prototype.parseConfig.call(this, val);
      break;
    case "items":
      this.items = new Items(this.world, val);
      this.items.setAllOwner(this);
      break;
    case "usingEquips":
      this.usingEquips = new UsingEquips(this.world, val) ;
      this.usingEquips.setAllOwner(this);
      break;
    case "lastSceneName":
    case "lastX":
    case "lastY":
    case "slotIndex":
    case "dzeny":
      this[key] = val;
      break;
    }
  }, this);
};

Char.prototype.handleUpdateConfig = function(config) {
  _.each(config, function(val, key) {
    this[key] = val;
  }, this);
  if (_.isObject(this.world.views.game)) {
    this.world.views.game.handleChar(this);
  }
};

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// TODO
// add useSelfItem and etcItem
Char.prototype.handleUpdateItems = function(items) {
  _.each(items, function(val, key) {
    _.each(val, function(itemConfig, slot) {
      if (_.isNull(itemConfig)) {
        this.items[key][slot] = null;
        return;
      }
      var item = this.create[capitalize(key)](itemConfig);
      item.owner = this;
      item.slotIndex = parseInt(slot);
      this.items[key][slot] = item;
    }, this);
  }, this);
  if (_.isObject(this.world.views.game)) {
    this.world.views.game.handleCharItems(this.items);
  }
};

Char.prototype.handleUpdateUsingEquips = function(usingEquips) {
  _.each(usingEquips, function(eqConfig, key) {
    if (_.isNull(eqConfig)) {
      this.usingEquips[key] = null;
      return;
    }
    var eq = this.create.Equipment(eqConfig);
    eq.owner = this;
    this.usingEquips[key] = eq;
  }, this);
  if (_.isObject(this.world.views.game)) {
    this.world.views.game.handleCharUsingEquips(this.usingEquips);
  }
};

Char.prototype.talkNpcById = function(npc) {
  var clientCall = {
    receiver: "Char",
    method:  "TalkNpcById",
    params: [npc.id]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.useItemBySlot = function(slot) {
  var clientCall = {
    receiver: "Char",
    method:  "UseItemBySlot",
    params: [slot]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.responseTalkingNpc = function(optIndex) {
  var clientCall = {
    receiver: "Char",
    method:  "ResponseTalkingNpc",
    params: [optIndex]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.cancelTalkingNpc = function() {
  var clientCall = {
    receiver: "Char",
    method:  "CancelTalkingNpc",
    params: []
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.handleNpcTalkBox = function(config) {
  console.log(config);
  this.world.views.game.handleNpcTalkBox(config);
};

Char.prototype.cancelOpeningShop = function() {
  var clientCall = {
    receiver: "Char",
    method:  "CancelOpeningShop",
    params: []
  };
  this.world.conn.sendJSON(clientCall);
};

function itemTypeByBaseId(i) {
  if (i >= 1 && i <= 5000) {
    return "equipment";
  } else if (i >= 5001 && i <= 10000) {
    return "useSelfItem";
  } else {
    return "etcItem";
  }
}

Char.prototype.buyItemFromOpeningShop = function(sellIndex) {
  var clientCall = {
    receiver: "Char",
    method:  "BuyItemFromOpeningShop",
    params: [sellIndex]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.sellItemToOpeningShop = function(baseId, slotIndex) {
  var clientCall = {
    receiver: "Char",
    method:  "SellItemToOpeningShop",
    params: [baseId, slotIndex]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.handleShop = function(shopConfig) {
  if (_.isNull(shopConfig)) {
    this.world.views.game.handleShop(shopConfig);
    return;
  }
  var items = _.map(shopConfig.items, function(item, idx) {
    var iType = itemTypeByBaseId(item.itemConfig.baseId);
    var it = this.create[capitalize(iType)](item);
    it.shopIndex = idx;
    return it;
  }, this);
  shopConfig.items = items;
  this.world.views.game.handleShop(shopConfig);
  console.log("handleShop:", shopConfig);
};

Char.prototype.run = function() {
  this.attach();
};

Char.prototype.move = function(x, y) {
  Bio.prototype.move.call(this, x, y);
  var clientCall = {
    receiver: "Char",
    method:  "Move",
    params: [x, y]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.shutDownMove = function() {
  Bio.prototype.shutDownMove.call(this);
  var clientCall = {
    receiver: "Char",
    method:  "ShutDownMove",
    params: []
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.logout = function() {
  var clientCall = {
    receiver: "Char",
    method: "Logout",
    params: []
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.equipBySlot = function(eq) {
  var eqSlot = _.indexOf(this.items.equipment, eq);
  if (eqSlot < 0) {
    return;
  }
  var clientCall = {
    receiver: "Char",
    method: "EquipBySlot",
    params: [eqSlot]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.unequipBySlot = function(eq) {
  var eqSlot = _.indexOf(this.usingEquips, eq);
  if (eqSlot < 0) {
    return;
  }
  var clientCall = {
    receiver: "Char",
    method: "UnequipBySlot",
    params: [eqSlot]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.talkScene = function(content) {
  if (_.isString(content) === false) {
    return;
  }
  var clientCall = {
    receiver: "Char",
    method: "TalkScene",
    params: [content]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.handleJoinScene = function(config) {
  this.id = config.id;
  this.world.scenes[config.sceneName].add(this);
  this.scene.focusObj = this;
  this.run();
};

Char.prototype.handleChatMessage = function(msg) {
  if (_.isObject(this.world.views.game)) {
    this.world.views.game.handleChatMessage(msg);
  }
};

Char.prototype.handleAttributesChange = function(atts) {
  _.each(atts, function(val, key) {
    this[key] = val;
  }, this);
  this.world.views.game.forceUpdate();
};

// handle collsion with 3d object on mouse events
Char.prototype.attach = function() {
  this.attachCanvas();
  this.attachScene();
};

Char.prototype.attachScene = function() {
};

Char.prototype.attachCanvas = function() {
  this.scene.focusObj = this;
  var canvas = this.scene.canvas;
  canvas.addEventListener("mousemove", this.handleCanvasMousemove.bind(this), false);
  $(canvas).on("mousestop", this.handleCanvasMousestop.bind(this));
  canvas.addEventListener("mouseup", this.handleCanvasMouseup.bind(this), false);
  canvas.addEventListener("mousedown", this.handleCanvasMousedown.bind(this), false);
  canvas.addEventListener("mouseleave", this.handleCanvasMouseleave.bind(this), false);
  canvas.addEventListener("mouseenter", this.handleCanvasMouseenter.bind(this), false);
  canvas.addEventListener("mousehover", this.handleCanvasMousehover.bind(this), false);
  canvas.addEventListener("click", this.handleCanvasClick.bind(this), false);
};

Char.prototype.handleCanvasMousemove = function(event) {
  this.buttons.canvas.isMoving = true;
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
                                 - (event.clientY / window.innerHeight) * 2 + 1,
                                 0.5);
  var projector = this.scene.projector;
  var ray = projector.pickingRay( vector, this.scene.camera );
  var objects = ray.intersectObjects( this.scene.threeScene.children, true );
  //
  var firstBio = _.find(objects, function(obj) {
    var mesh = obj.object;
    return mesh.userData instanceof Bio;
  });
  firstBio = (_.isUndefined(firstBio) ? null : firstBio.object.userData);
  if (firstBio && firstBio != this) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "";
  }
  this.lastMiniTarget = firstBio;
  this.lastClientX = event.clientX;
  this.lastClientY = event.clientY;
  this.world.views.game.handleMiniTarget(firstBio);
  if (this.buttons.canvas.mouse.isDowning &&
      this.buttons.canvas.mouse.isHovering) {
    var foundGround = _.find(objects, function(obj) {
      var mesh = obj.object;
      return mesh.userData.isGround;
    });
    if (_.isObject(foundGround) && (firstBio instanceof Npc) == false) {
      this.move(foundGround.point.x, foundGround.point.y);
    }
  }
};


Char.prototype.handleCanvasMousestop = function(event) {
  this.buttons.canvas.isMoving = false;
};

Char.prototype.handleCanvasMouseup = function(event) {
  this.buttons.canvas.mouse.isUping = true;
  this.buttons.canvas.mouse.isDowning = false;
  if (this.moveState.running) {
    this.shutDownMove();
  }
};

Char.prototype.onCameraPositionChange = function(camera) {
  if (this.buttons.canvas.mouse.isMoving === false) {
    this.handleCanvasMousemove({clientX: this.lastClientX,
                                clientY: this.lastClientY});
  }
};

Char.prototype.handleCanvasMousedown = function(event) {
  event.preventDefault();
  this.lastClientX = event.clientX;
  this.lastClientY = event.clientY;
  this.buttons.canvas.mouse.isUping = false;
  this.buttons.canvas.mouse.isDowning = true;
  this.handleCanvasMousemove(event);
  if (document.activeElement != document.body) {
    document.activeElement.blur();
  }
};

Char.prototype.handleCanvasMouseleave = function(event) {
  this.buttons.canvas.mouse.isHovering = false;
};

Char.prototype.handleCanvasMouseenter = function(event) {
  this.buttons.canvas.mouse.isHovering = true;
};

Char.prototype.handleCanvasMousehover = function(event) {
  this.buttons.canvas.mouse.isHovering = true;
};

Char.prototype.handleCanvasClick = function(event) {
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
                                 - (event.clientY / window.innerHeight) * 2 + 1,
                                 0.5);
  var projector = this.scene.projector;
  var ray = projector.pickingRay( vector, this.scene.camera );
  var objects = ray.intersectObjects( this.scene.threeScene.children, true );
  _.each(objects, function(obj) {
    var mesh = obj.object;
    if (mesh.userData instanceof Bio) {
      var bio = mesh.userData;
      event.char = this;
      bio.emit("click", event);
    }
  }.bind(this));
};

Char.prototype.destroy = function() {
  this.scene.focusObj = null;
  var canvas = this.scene.canvas;
  canvas.removeEventListener("mousemove", this.handleCanvasMousemove, false);
  $(canvas).off("mousestop", this.handleCanvasMousestop);
  canvas.removeEventListener("mouseup", this.handleCanvasMouseup, false);
  canvas.removeEventListener("mousedown", this.handleCanvasMousedown, false);
  canvas.removeEventListener("mouseleave", this.handleCanvasMouseleave, false);
  canvas.removeEventListener("mouseenter", this.handleCanvasMouseenter, false);
  canvas.removeEventListener("mousehover", this.handleCanvasMousehover, false);
  canvas.removeEventListener("click", this.handleCanvasClick, false);
};
