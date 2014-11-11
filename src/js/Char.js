var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var cp = require('chipmunk');
var THREE = require('three');
var Items = require('./Items.js');
var UsingEquips = require('./UsingEquips.js');
var Bio = require('./Bio.js');
var Mob = require('./Mob.js');
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
  this.hotKeys = {normal: new Array(4),
                  skill: new Array(2)};
  this.skillBaseIds = [];
  this.lastSceneName = '';
  this.lastX = 0;
  this.lastY = 0;
  this.lastClientX = 0;
  this.lastClientY = 0;
  this.lastMiniTarget = null;
  this.lastRequestId = null;
  this.dzeny = 0;
  this.buttons = {canvas:
                  {mouse: {isDowning: false,
                           isUping: false,
                           isHovering: true,
                           isMoving: false,
                           leftDowning: false,
                           rightDowning: false}
                  },
                  document: {
                    key: {shift: false}
                  }
                 };
  this.dragStartViewName = "";
  this.draggingItem = null;
  this.draggingSkillBaseId = 0;
  this.canvasEvents = {
    "mousemove": this.handleCanvasMousemove.bind(this),
    "mousestop": this.handleCanvasMousestop.bind(this),
    "mouseup": this.handleCanvasMouseup.bind(this),
    "mousedown": this.handleCanvasMousedown.bind(this),
    "mouseleave": this.handleCanvasMouseleave.bind(this),
    "mouseenter": this.handleCanvasMouseenter.bind(this),
    "mousehover": this.handleCanvasMousehover.bind(this),
    "mousewheel": this.handleCanvasMousewheel.bind(this),
    "dragover": this.handleCanvasDragOver.bind(this),
    "drop": this.handleCanvasDrop.bind(this),
    "click": this.handleCanvasClick.bind(this)
  };
  this.documentEvents = {
    "keydown": this.handleDocumentKeydown.bind(this),
    "keyup": this.handleDocumentKeyup.bind(this)
  };
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
    case "skillBaseIds":
    case "hotKeys":
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

Char.prototype.handleSkillBaseIds = function(sids) {
  this.skillBaseIds = sids;
  if (_.isObject(this.world.views.game)) {
    this.world.views.game.handleCharSkillBaseIds(sids);
  }
};

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// TODO
// add useSelfItem and etcItem
Char.prototype.handleUpdateItems = function(items, isUpsert) {
  _.each(items, function(val, key) {
    _.each(val, function(itemConfig, slot) {
      if (_.isNull(itemConfig)) {
        this.items[key][slot] = null;
        return;
      }
      if(isUpsert) {
        this.items[key][slot].handleUpdateConfig(itemConfig);
      } else {
        var item = this.create[capitalize(key)](itemConfig);
        item.owner = this;
        item.slotIndex = parseInt(slot);
        this.items[key][slot] = item;
      }
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


Char.prototype.dropItem = function(id, slotIndex) {
  var clientCall = {
    receiver: "Char",
    method:  "DropItem",
    params: [id, slotIndex]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.useSkillByBaseId = function(sid) {
  if (sid <= 0) {
    return;
  }
  var clientCall = {
    receiver: "Char",
    method:  "UseSkillByBaseId",
    params: [sid]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.useFireBall = function() {
  var clientCall = {
    receiver: "Char",
    method:  "UseFireBall",
    params: []
  };
  this.world.conn.sendJSON(clientCall);
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
  if (this.isDied()) {
    return;
  }
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

Char.prototype.setLeftSkillHotKey = function(sid) {
  var clientCall = {
    receiver: "Char",
    method: "SetLeftSkillHotKey",
    params: [sid]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.setNormalHotKey = function(index, itemBaseId, slotIndex) {
  if (index > 4 || itemBaseId <= 0 || slotIndex < 0) {
    return;
  }
  var clientCall = {
    receiver: "Char",
    method: "SetNormalHotKey",
    params: [index, itemBaseId, slotIndex]
  };
  this.world.conn.sendJSON(clientCall);
};

Char.prototype.setRightSkillHotKey = function(sid) {
  var clientCall = {
    receiver: "Char",
    method: "SetRightSkillHotKey",
    params: [sid]
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
  // FIXME
  // should not clone again, i didn't known why can't show the mesh
  // after change another scene.
  this.threeBody = this.world.assets.mesh[this.bodyViewId].clone();
  this.threeBody.userData = this;
  //
  this.world.scenes[config.sceneName].add(this);
  if (this.scene) {
    this.scene.focusObj = this;
    this.run();
  }
};

Char.prototype.handleLeaveScene = function() {
  this.destroy();
  this.scene.remove(this);
};

Char.prototype.handleSetPosition = function(pos) {
  this.setPosition(pos);
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
  var doc = $(document);
  _.each(this.documentEvents, function(event, eventName) {
    doc.on(eventName, event);
  });
};

Char.prototype.attachCanvas = function() {
  this.scene.focusObj = this;
  var canvas = $(this.scene.canvas);
  _.each(this.canvasEvents, function(event, eventName) {
    canvas.on(eventName, event);
  });
};

THREE.Vector3.prototype.pickingRay = function ( camera ) {
  var tan = Math.tan( 0.5 * THREE.Math.degToRad( camera.fov ) ) / camera.zoom;
  this.x *= tan * camera.aspect;
  this.y *= tan;
  this.z = - 1;
  return this.transformDirection( camera.matrixWorld );

};

Char.prototype.handleCanvasMousemove = function(event) {
  // console.log("mouse position: ", event.clientX, event.clientY);
  if (event.preventDefault) {
    event.preventDefault();
  }
  this.buttons.canvas.isMoving = true;
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
                                 - (event.clientY / window.innerHeight) * 2 + 1,
                                 0.5);
  var raycaster = this.scene.raycaster;
  vector.pickingRay(this.scene.camera);
  raycaster.set(this.scene.camera.position, vector);
  var objects = raycaster.intersectObjects( this.scene.threeScene.children, false );
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
  this.world.views.game.handleMiniTarget(firstBio, false);
  if (this.buttons.canvas.mouse.isDowning &&
      this.buttons.canvas.mouse.isHovering) {
    var foundGround = _.find(objects, function(obj) {
      var mesh = obj.object;
      return mesh.userData.isGround;
    });
    if (firstBio == this) {
      this.shutDownMove();
      return;
    } else if (firstBio instanceof Mob) {
      if (this.hotKeys.skill[0]) {
        this.useSkillByBaseId(this.hotKeys.skill[0].skillBaseId);
      }
    } else if (this.buttons.document.key.shift) {
      if (this.buttons.canvas.mouse.leftDowning) {
        this.useSkillByBaseId(this.hotKeys.skill[0].skillBaseId);
      } else if(this.buttons.canvas.mouse.rightDowning) {
        this.useSkillByBaseId(this.hotKeys.skill[1].skillBaseId);
      }
    } else if (_.isObject(foundGround) && (firstBio instanceof Npc) == false) {
      this.move(foundGround.point.x, foundGround.point.y);
    }
  }
};


Char.prototype.handleCanvasMousestop = function(event) {
  this.buttons.canvas.isMoving = false;
};

Char.prototype.handleCanvasMouseup = function(event) {
  event.preventDefault();
  this.buttons.canvas.mouse.isUping = true;
  this.buttons.canvas.mouse.isDowning = false;
  switch (event.which) {
  case 1:
    this.buttons.canvas.mouse.leftDowning = false;
    break;
  case 3:
    this.buttons.canvas.mouse.rightDowning = false;
  }
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
  switch (event.which) {
  case 1:
    this.buttons.canvas.mouse.leftDowning = true;
    break;
  case 3:
    this.buttons.canvas.mouse.rightDowning = true;
  }
  this.handleCanvasMousemove(event);
  if (document.activeElement != document.body) {
    document.activeElement.blur();
  }
};

Char.prototype.handleCanvasMouseleave = function(event) {
  event.preventDefault();
  this.buttons.canvas.mouse.isHovering = false;
  this.shutDownMove();
};

Char.prototype.handleCanvasMouseenter = function(event) {
  this.buttons.canvas.mouse.isHovering = true;
};

Char.prototype.handleCanvasMousehover = function(event) {
  this.buttons.canvas.mouse.isHovering = true;
};

Char.prototype.handleCanvasMousewheel = function(event) {
  var e = event.originalEvent;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  this.scene.camera.position.z += delta * 2;
  return false;
};

Char.prototype.handleCanvasDragOver = function(event) {
  event.preventDefault();
};

Char.prototype.handleCanvasDrop = function(event) {
  if (this.draggingItem && this.dragStartViewName == "CharItems") {
    this.dropItem(this.draggingItem.baseId, this.draggingItem.slotIndex);
  }
};

Char.prototype.handleDocumentKeydown = function(event) {
  this.buttons.document.key.shift = event.shiftKey;
  if (event.shiftKey) {
    this.shutDownMove();
  }
};

Char.prototype.handleDocumentKeyup = function(event) {
  this.buttons.document.key.shift = event.shiftKey;
};

Char.prototype.handleCanvasClick = function(event) {
  event.preventDefault();
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
                                 - (event.clientY / window.innerHeight) * 2 + 1,
                                 0.5);
  var raycaster = this.scene.raycaster;
  vector.pickingRay(this.scene.camera);
  raycaster.set(this.scene.camera.position, vector);
  var objects = raycaster.intersectObjects( this.scene.threeScene.children, false );
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
  var canvas = $(this.scene.canvas);
  _.each(this.canvasEvents, function(event, eventName) {
    canvas.off(eventName, event);
  });
  var doc = $(document);
  _.each(this.documentEvents, function(event, eventName) {
    doc.off(eventName, event);
  });
};
