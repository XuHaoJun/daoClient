var THREE = require('three');
var cp = require('chipmunk');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var SceneObject = module.exports = function () {
  EventEmitter2.call(this);
  this.id = -1;
  this.scene = null;
  this.bodyViewId = 0;
  this.threeBody = null;
  this.cpBody = null;
  this.glowEffect = null;
};

SceneObject.prototype = Object.create(EventEmitter2.prototype);

SceneObject.prototype.setPosition = function(pos) {
  this.cpBody.setPos(pos);
  this.threeBody.position.x = pos.x;
  this.threeBody.position.y = pos.y;
};

SceneObject.prototype.setAngle = function(angle) {
  this.cpBody.setAngle(angle);
  this.threeBody.rotation.z = angle;
};

// FIXME
SceneObject.prototype.setDefaultGlowEffect = function() {
  var customMaterial = new THREE.ShaderMaterial(
    {
      uniforms:
      {
        "c":   { type: "f", value: 0.6 },
        "p":   { type: "f", value: 4.8 },
        glowColor: { type: "c", value: new THREE.Color(0xff0000) },
        viewVector: { type: "v3", value: new THREE.Vector3(0,0,0) }
      },
      vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
      fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      // blending: THREE.NormalBlending,
      transparent: true
    });
  this.glowEffect = new THREE.Mesh( this.threeBody.geometry.clone(),
                                    customMaterial );
  this.glowEffect.scale.multiplyScalar(1.2);
  this.glowEffect.castShadow = false;
  this.glowEffect.receiveShadow = false;
  this.glowEffect.visible = true;
};

SceneObject.prototype.lookAt = function(pos) {
  var toTarget = cp.v(pos.x - this.cpBody.p.x,
                      pos.y - this.cpBody.p.y);
  var desiredAngle = Math.atan2(-toTarget.x, toTarget.y);
  this.setAngle(desiredAngle);
};

SceneObject.prototype.syncRotation = function() {
  this.threeBody.rotation.z = this.cpBody.a;
};

SceneObject.prototype.syncCpAndThree = function() {
  var cpPos = this.cpBody.getPos();
  this.threeBody.position.setX(cpPos.x);
  this.threeBody.position.setY(cpPos.y);
  // var cpAngle = this.cpBody.a;
  // this.threeBody.rotation.z = cpAngle;
  if (this.glowEffect) {
    window.glowEffect = this.glowEffect;
    this.glowEffect.position.copy(this.threeBody.position);
    this.glowEffect.rotation.copy(this.threeBody.rotation);
    if (this.scene && this.scene.camera) {
      // this.glowEffect.material.uniforms.viewVector.value =
      //   new THREE.Vector3().subVectors( this.scene.camera.position );
      // this.glowEffect.material.uniforms.viewVector.value = this.scene.camera.position;
    }
  }
  this.emit("syncCpAndThree", cpPos);
};
