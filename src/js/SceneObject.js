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

SceneObject.prototype.screenXY = function (camera) {
  var width = window.innerWidth, height = window.innerHeight;
  var widthHalf = width / 2, heightHalf = height / 2;
  var vector = new THREE.Vector3();
  vector.setFromMatrixPosition(this.threeBody.matrixWorld);
  vector.project(camera);
  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;
  return {x: vector.x, y: vector.y};
};

SceneObject.prototype.screenXY1 = function (camera, jqdiv) {
  var pos = this.threeBody.position.clone();
  var projScreenMat = new THREE.Matrix4();
  projScreenMat.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
  pos.applyMatrix4(projScreenMat);
  if (jqdiv) {
    return { x: ( pos.x + 1 ) * jqdiv.width() / 2 + jqdiv.offset().left,
             y: ( - pos.y + 1) * jqdiv.height() / 2 + jqdiv.offset().top };
  }
  return { x: ( pos.x + 1 ) * window.innerWidth / 2,
           y: ( - pos.y + 1) * window.innerHeight / 2};
};

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
  this.threeBody.lookAt(new THREE.Vector3(pos.x, pos.y, this.threeBody.position.z + 2));
  this.setAngle(desiredAngle);
};

SceneObject.prototype.syncRotation = function() {
  this.threeBody.rotation.z = this.cpBody.a;
};

SceneObject.prototype.syncCpAndThree = function() {
  var cpPos = this.cpBody.getPos();
  this.threeBody.position.setX(cpPos.x);
  this.threeBody.position.setY(cpPos.y);
  this.threeBody.rotation.z = this.cpBody.a;
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
