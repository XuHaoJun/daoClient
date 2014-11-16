var _ = require('lodash');
var cp = require('chipmunk');
var parseClient = require('./util/parseClient.js');
var SceneObject = require('./SceneObject.js');

var Bio = module.exports = function (world, config) {
  SceneObject.call(this);
  this.name = '';
  this.world = world;
  this.cpGroup = 1;
  this.moveState = {
    running: false,
    beforeMoveFunc: null,
    targetPos: null,
    baseVelocity: null,
    lastVelocity: null,
    lastTargetPos: null,
    lastAngle: null
  };
  //
  this.level = 0;
  // main attribue
  this.str = 0;
  this.vit = 0;
  this.wis = 0;
  this.spi = 0;
  // sub attribue
  this.def   = 0;
  this.mdef  = 0;
  this.atk   = 0;
  this.matk  = 0;
  this.maxHp = 0;
  this.hp    = 0;
  this.maxMp = 0;
  this.mp    = 0;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Bio.prototype = Object.create(SceneObject.prototype);

// FIXME
Bio.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "id":
    case "name":
    case "bodyViewId":
    case "level":
    case "str":
    case "vit":
    case "wis":
    case "spi":
    case "def":
    case "mdef":
    case "atk":
    case "matk":
    case "maxHp":
    case "hp":
    case "maxMp":
    case "mp":
      this[key] = val;
      break;
    case "cpBody":
      this.cpBody = parseClient.cpBody(val);
      break;
    case "moveBaseVelocity":
      this.moveState.baseVelocity = cp.v(val.x, val.y);
      break;
    default:
      console.log("unknown bio config ", "key: ", key, "val: ", val);
      break;
    }
  }, this);
  if (_.isNumber(config.bodyViewId)) {
    this.threeBody = this.world.assets.mesh[this.bodyViewId].clone();
    this.threeBody.userData = this;
    // this.setDefaultGlowEffect();
    this.syncCpAndThree();
    this.syncRotation();
  }
};

Bio.prototype.handleUpdateBioConfig = function(config) {
  _.each(config, function(val, key) {
    this[key] = val;
  }, this);
  if (_.isObject(this.world.views.game) &&
      this.world.account.usingChar.lastMiniTarget == this) {
    this.world.views.game.handleMiniTarget(this, true);
  }
};

Bio.prototype.handleUpdateCpBody = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "position":
      this.cpBody.setPos(cp.v(val.x, val.y));
    case "angle":
      this.cpBody.setAngle(val);
    }
  }, this);
};

Bio.prototype.onKill = function(target) {
};

Bio.prototype.onBeKilled = function(killer) {
  // TODO
  // check have die animation for play
};

Bio.prototype.move = function(x, y) {
  this.moveState.running = true;
  this.moveState.targetPos = cp.v(x, y);
};

Bio.prototype.shutDownMove = function() {
  this.moveState.running = false;
  this.cpBody.setForce(cp.v(0, 0));
  this.cpBody.setVel(cp.v(0, 0));
  this.removeAllListeners('moveOnTargetPosition');
};

Bio.prototype.moveUpdate = function(delta) {
  if (this.moveState.running == false) {
    return;
  }
  if (cp.v.eql(this.cpBody.getPos(), this.moveState.targetPos)) {
    this.emit('moveOnTargetPosition', this.moveState.targetPos);
    this.shutDownMove();
    return;
  }
  if (_.isFunction(this.moveState.beforeMoveFunc)) {
    var keepMove = this.moveState.beforeMoveFunc(delta);
    if (keepMove == false) {
      return;
    }
  }
  var moveVelocity = cp.v(this.moveState.baseVelocity.x,
                          this.moveState.baseVelocity.y);
  var cpBodyPos = this.cpBody.getPos();
  var moveVect = cp.v(this.moveState.targetPos.x - cpBodyPos.x,
                      this.moveState.targetPos.y - cpBodyPos.y);
  if (Math.abs(delta * moveVelocity.x) >= Math.abs(moveVect.x)) {
    cpBodyPos = this.cpBody.getPos();
    var reachX = cp.v(this.moveState.targetPos.x,
                      cpBodyPos.y);
    this.cpBody.setPos(reachX);
    moveVect.x = 0;
  }
  if (Math.abs(delta * moveVelocity.y) >= Math.abs(moveVect.y)) {
    cpBodyPos = this.cpBody.getPos();
    var reachY = cp.v(cpBodyPos.x,
                      this.moveState.targetPos.y);
    this.cpBody.setPos(reachY);
    moveVect.y = 0;
  }
  if (cp.v.eql(this.cpBody.getPos(), this.moveState.targetPos)) {
    this.emit('moveOnTargetPosition', this.moveState.targetPos);
    this.shutDownMove();
    return;
  }
  if (moveVect.x < 0) {
    moveVelocity.x *= -1;
  } else if (moveVect.x == 0) {
    moveVelocity.x = 0;
  }
  if (moveVect.y < 0) {
    moveVelocity.y *= -1;
  } else if (moveVect.y == 0) {
    moveVelocity.y = 0;
  }
  var cpBody = this.cpBody;
  var vel = cpBody.getVel();
  var m = cpBody.m;
  var t = delta;
  var desiredVel = moveVelocity;
  var velChange = cp.v(desiredVel.x - vel.x, desiredVel.y - vel.y);
  var force = cp.v(m * velChange.x / t,
                   m * velChange.y / t);
  cpBody.setForce(force);
  this.lookAt(this.moveState.targetPos);
  this.moveState.lastTargetPos = cp.v(this.moveState.targetPos.x,
                                      this.moveState.targetPos.y);
  // console.log("position: ", cpBody.getPos());
};

Bio.prototype.afterUpdate = function(delta) {
  this.moveUpdate(delta);
};

// recevie from server data

Bio.prototype.handleMoveStateChange = function(config) {
  console.log(config);
  if ((config.running == true &&
       this.moveState.running == false) ||
      (config.running == true &&
       this.moveState.running == true)) {
    if (config.baseVelocity) {
      this.moveState.baseVelocity = cp.v(config.baseVelocity.x,
                                         config.baseVelocity.y);
    }
    Bio.prototype.move.call(this, config.targetPos.x,
                            config.targetPos.y);
  } else if (config.running == false &&
             this.moveState.running == true) {
    Bio.prototype.shutDownMove.call(this);
  }
};

Bio.prototype.isDied = function() {
  return this.hp <= 0;
};
