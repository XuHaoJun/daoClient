var THREE = require('three');
var cp = require('chipmunk');
var SceneObject = module.exports = function () {
  this.scene = null;
  this.bodyViewId = 0;
  this.threeBody = null;
  this.cpBody = null;
};

SceneObject.prototype.setPosition = function(pos) {
  this.cpBody.setPos(pos);
  this.threeBody.position.x = pos.x;
  this.threeBody.position.y = pos.y;
};

SceneObject.prototype.setAngle = function(angle) {
  this.cpBody.setAngle(angle);
  this.threeBody.rotation.y = angle;
};

SceneObject.prototype.lookAt = function(pos) {
  this.threeBody.lookAt(new THREE.Vector3(pos.x,
                                          pos.y,
                                          this.threeBody.position.z));
  var toTarget = cp.v(pos.x - this.cpBody.p.x,
                      pos.y - this.cpBody.p.y);
  var desiredAngle = Math.atan2(toTarget.x, toTarget.y);
  this.cpBody.setAngle(desiredAngle);
};

SceneObject.prototype.syncCpAndThree = function() {
  var cpPos = this.cpBody.getPos();
  this.threeBody.position.x = cpPos.x;
  this.threeBody.position.y = cpPos.y;
  // this.threeBody.rotation.y = this.cpBody.a;
};
