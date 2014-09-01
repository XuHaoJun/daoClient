var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var THREE = require('three');
var Items = require('./Items.js');
var UsingEquips = require('./UsingEquips.js');
var Bio = require('./Bio.js');
var Account = require('./Account.js');

var Char = module.exports = function (account, config) {
  Bio.call(this, account.world);
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
  this.buttons = {canvas: {mouse: {isDowning: false,
                                   isUping: false,
                                   isHovering: true,
                                   isMoving: false}}};
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
      this[key] = val;
      break;
    }
  }, this);
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

Char.prototype.equipByIndex = function(eq) {
  var eqIndex = _.indexOf(this.items.equipment, eq);
  if (eqIndex < 0) {
    return;
  }
  var clientCall = {
    receiver: "Char",
    method: "EquipByIndex",
    params: [eqIndex]
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

// handle collsion with 3d object on mouse events
Char.prototype.attach = function() {
  this.attachCanvas();
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
  // if (firstBio != this.lastMiniTarget) {
  //   this.lastMiniTarget
  // }
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
    if (_.isObject(foundGround)) {
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
