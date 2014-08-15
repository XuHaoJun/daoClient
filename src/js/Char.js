var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var THREE = require('three');
var Bio = require('./Bio.js');

var Char = module.exports = function (account, config) {
  Bio.call(this);
  this.account = account;
  this.world = account.world;
  this.slotIndex = 0;
  this.lastSceneName = '';
  this.lastX = 0;
  this.lastY = 0;
  this.lastClientX = 0;
  this.lastClientY = 0;
  this.targetInfo = {};
  this.buttons = {canvas: {mouse: {isDowning: false, isUping: false}}};
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
    case "lastSceneName":
    case "lastX":
    case "lastY":
    case "slotIndex":
      this[key] = val;
      break;
    }
  }.bind(this));
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
  this.world.handleLogout(); // should wait server response allow logout
};

Char.prototype.talkScene = function(content) {
  if (_.isString(content) == false) {
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
  console.log("Canvas: ", canvas);
  canvas.addEventListener("mousemove", this.handleCanvasMousemove.bind(this), false);
  canvas.addEventListener("mouseup", this.handleCanvasMouseup.bind(this), false);
  canvas.addEventListener("mousedown", this.handleCanvasMousedown.bind(this), false);
  canvas.addEventListener("mouseleave", this.handleCanvasMouseleave.bind(this), false);
  canvas.addEventListener("click", this.handleCanvasClick.bind(this), false);
};

Char.prototype.handleCanvasMousemove = function(event) {
  if (_.isFunction(event.preventDefault)) {
    event.preventDefault();
  }
  this.lastClientX = event.clientX;
  this.lastClientY = event.clientY;
  if (this.buttons.canvas.mouse.isDowning) {
    console.log("event.clientX: ", event.clientX);
    console.log("event.clientY: ", event.clientY);
    var mouseCoord = new THREE.Vector3(event.clientX, event.clientY, 0.5);
    var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,
                                    - ( event.clientY / window.innerHeight ) * 2 + 1,
                                    0.5 );
    var projector = new THREE.Projector();
    var ray = projector.pickingRay( vector, this.scene.camera );
    var objects = ray.intersectObjects( this.scene.threeScene.children, true );
    console.log("mousemove: ", objects);
    var foundGround = _.find(objects, function(obj) {
      var mesh = obj.object;
      return mesh == this.scene.ground;
    }.bind(this));
    if (_.isObject(foundGround)) {
      console.log("foundGround: ", foundGround);
      this.move(foundGround.point.x, foundGround.point.y);
    }
  }
};

Char.prototype.handleCanvasMouseup = function(event) {
  if (_.isFunction(event.preventDefault)) {
    event.preventDefault();
  }
  this.buttons.canvas.mouse.isUping = true;
  this.buttons.canvas.mouse.isDowning = false;
  if (this.moveState.running) {
    this.shutDownMove();
  }
};

Char.prototype.onCameraPositionChange = function(camera) {
  this.handleCanvasMousemove({clientX: this.lastClientX,
                              clientY: this.lastClientY});
};

Char.prototype.handleCanvasMousedown = function(event) {
  if (_.isFunction(event.preventDefault)) {
    event.preventDefault();
  }
  this.lastClientX = event.clientX;
  this.lastClientY = event.clientY;
  this.buttons.canvas.mouse.isUping = false;
  this.buttons.canvas.mouse.isDowning = true;
  this.handleCanvasMousemove(event);
};

Char.prototype.handleCanvasMouseleave = function(event) {
  event.preventDefault();
  this.buttons.canvas.mouse.isUping = false;
  this.buttons.canvas.mouse.isDowning = false;
};

Char.prototype.handleCanvasClick = function(event) {
};

Char.prototype.destroy = function() {
  this.scene.focusObj = null;
  var canvas = this.scene.canvas;
  canvas.removeEventListener("mousemove", this.handleCanvasMousemove);
  canvas.removeEventListener("mouseup", this.handleCanvasMouseup);
  canvas.removeEventListener("mousedown", this.handleCanvasMousedown);
  canvas.removeEventListener("mouseleave", this.handleCanvasMouseleave);
  canvas.removeEventListener("click", this.handleCanvasClick);
};
