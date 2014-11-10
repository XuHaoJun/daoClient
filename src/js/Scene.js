var EventEmitter2 = require('eventemitter2').EventEmitter2;
var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var THREE = require('three');
var cp = require('chipmunk');
var SceneObject = require('./SceneObject.js');
var parseClient = require('./util/parseClient.js');
var THREEx = {
  WindowResize: require('threex.windowresize').WindowResize
};

var Scene = module.exports = function (world, config) {
  this.world = world;
  this.name = '';
  this.width = 0;
  this.height = 0;
  this.grounds = [];
  this.threeScene = new THREE.Scene();
  this.clock = new THREE.Clock();
  this.projector = new THREE.Projector();
  this.cpSpace = new cp.Space();
  this.cpSpace.iterations = 10;
  this.threeResize = null;
  this.focusObj = null;
  this.camera = null;
  this.renderer = null;
  this.requestId = null;
  this.wallCpShapes = [];
  this.staticShapes = [];
  // this.staticCpBodys = [];
  this.canvas = world.threeCanvas;
  this.sceneObjects = {};
  // TODO addDefaultLight just for test will remove in the future
  this.addDefaultLight();
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Scene.prototype = Object.create(EventEmitter2.prototype);

Scene.prototype.addDefaultLight = function() {
  var light;
  // add a ambient light
  var ambient = new THREE.AmbientLight( 0x444444 );
  this.threeScene.add( ambient );
  // add a light in front
  light = new THREE.SpotLight( 0xFFF4E5, 1, 0, Math.PI / 2, 1 );
  light.position.set( 0, 0, 1000 );
  // light.target.position.set( 0, 0, 0 );

  light.castShadow = true;
  // light.shadowCameraNear = 200;
  // light.shadowCameraFar = 50;
  // light.shadowCameraFov = 50;
  // light.shadowCameraVisible = true;
  light.shadowCameraNear = 500;
  light.shadowCameraFar = 4000;
  light.shadowCameraFov = 30;

  // light.shadowBias = 0.0001;
  light.shadowDarkness = 0.5;
  var SHADOW_MAP_WIDTH = 1024, SHADOW_MAP_HEIGHT = 1024;
  light.shadowMapWidth = SHADOW_MAP_WIDTH;
  light.shadowMapHeight = SHADOW_MAP_HEIGHT;

  // light       = new THREE.DirectionalLight('white', 1);
  // light.castShadow = true;
  // light.shadowDarkness = 0.5;
  // light.shadowCameraRight = 5;
  // light.shadowCameraLeft = -5;
  // light.shadowCameraTop = 5;
  // light.shadowCameraBottom = -5;
  // light.shadowCameraNear = 2;
  // light.shadowCameraFar = 100;
  // light.position.set(-400,2,500).normalize();
  this.threeScene.add( light );
  // add a light behind
  // light       = new THREE.DirectionalLight('white', 0.75);
  // light.position.set(-0.5, 2.5, -2);
  // this.threeScene.add( light );
};

Scene.prototype.createWallCpBodys = function() {
  var w = this.width,
      h = this.height;
  var walls = this.wallCpShapes;
  var space = this.cpSpace;
  var wall;
  wall = new cp.SegmentShape(space.staticBody,
                             cp.v(-w / 2, h /2),
                             cp.v(w / 2, h / 2),
                             0);
  walls.push(wall);
  wall = new cp.SegmentShape(space.staticBody,
                             cp.v(-w / 2, -h / 2),
                             cp.v(w / 2, -h / 2),
                             0);
  walls.push(wall);
  wall = new cp.SegmentShape(space.staticBody,
                             cp.v(-w / 2, h / 2),
                             cp.v(-w / 2, -h / 2),
                             0);
  walls.push(wall);
  wall = new cp.SegmentShape(space.staticBody,
                             cp.v(w / 2, h / 2),
                             cp.v(w / 2, -h / 2),
                             0);
  walls.push(wall);
};

Scene.prototype.parseConfig = function(config) {
  var run = false;
  _.each(config, function(val, key) {
    switch(key) {
    case "name":
    case "width":
    case "height":
      this[key] = val;
      break;
    case "staticBodys":
      _.each(val, function(body) {
        _.each(body.shapes, function(shape) {
          var realShape = parseClient.cpShape(shape, this.cpSpace.staticBody);
          this.cpSpace.addShape(realShape);
          if (_.isObject(realShape)) {
            this.staticShapes.push(realShape);
          }
        }, this);
      }, this);
      break;
    case "run":
      run = val;
      break;
    }
  }, this);
  if (this.width > 0 && this.height > 0 &&
      _.isEmpty(this.grounds)) {
    this.addDefaultPlaneGround(config["defaultGroundTextureName"]);
  }
  if (run === true) {
    this.run();
  }
};

Scene.prototype.addDefaultPlaneGround = function(groundTextureName) {
  var image = this.world.assets.image[groundTextureName];
  var geometry = new THREE.PlaneGeometry(this.width, this.height);
  var material;
  if (_.isElement(image)) {
    var texture = THREE.ImageUtils.loadTexture(image.src);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 3;
    texture.repeat.y = 3;
    material  = new THREE.MeshPhongMaterial({map: texture});
  } else {
    material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
  }
  var mesh = new THREE.Mesh(geometry, material);
  mesh.material.side = THREE.DoubleSide;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.userData = {isGround: true};
  this.grounds.push(mesh);
  this.threeScene.add(mesh);
};

Scene.prototype.setPlaneGround = function(image) {
  var texture;
  if (_.isElement(image)) {
    texture = THREE.ImageUtils.loadTexture(image.src);
  } else {
    return;
  }
  var geometry = new THREE.PlaneGeometry(this.width, this.height);
  var material  = new THREE.MeshPhongMaterial({map: texture});
  var mesh = new THREE.Mesh(geometry, material);
  this.grounds.push(mesh);
  this.threeScene.add(mesh);
};

Scene.prototype.add = function(sb) {
  if (sb.scene == this) {
    return;
  }
  sb.scene = this;
  this.threeScene.add(sb.threeBody);
  this.cpSpace.addBody(sb.cpBody);
  _.each(sb.cpBody.shapes, function(shape) {
    this.cpSpace.addShape(shape);
  }, this);
  this.sceneObjects[sb.id] = sb;
  if (sb.glowEffect) {
    this.threeScene.add(sb.glowEffect);
  }
  this.emit("add", sb);
  sb.emit("sceneAdd", sb);
};

Scene.prototype.remove = function(sb) {
  if (sb.scene != this) {
    return;
  }
  sb.scene = null;
  this.threeScene.remove(sb.threeBody);
  this.cpSpace.removeBody(sb.cpBody);
  _.each(sb.cpBody.shapes, function(shape) {
    this.cpSpace.removeShape(shape);
  }, this);
  delete this.sceneObjects[sb.id];
  if (sb.glowEffect) {
    this.threeScene.remove(sb.glowEffect);
  }
  this.emit("remove", sb);
  sb.emit("sceneRemove", sb);
};

Scene.prototype.handleAddItem = function(itemConfig) {
};

Scene.prototype.handleAddChar = function(charConfig) {
  var char = this.world.create.Char({world: this.world}, charConfig);
  this.add(char);
};

Scene.prototype.handleAddNpc = function(npcConfig) {
  var npc = this.world.create.Npc(npcConfig);
  this.add(npc);
};

Scene.prototype.handleAddMob = function(mobConfig) {
  var mob = this.world.create.Mob(mobConfig);
  this.add(mob);
};

Scene.prototype.handleAddFireBall = function(config)  {
  var fireBall = this.world.create.FireBall(config);
  this.add(fireBall);
};

Scene.prototype.handleRemoveById = function(id, sceneName) {
  if (sceneName != this.name) {
    return;
  }
  this.remove(this.sceneObjects[id]);
};

Scene.prototype.attachCanvas = function(threeCanvas) {
  var canvas = (threeCanvas? threeCanvas : this.canvas);
  if (_.isUndefined(canvas) || _.isNull(canvas)) {
    canvas = document.getElementById("threeCanvas");
    if (_.isElement(canvas)) {
      this.canvas = canvas;
    } else {
      return;
    }
  }
  this.renderer = new THREE.WebGLRenderer({canvas: canvas});
  this.renderer.shadowMapEnabled = true;
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.camera = new THREE.PerspectiveCamera(65,
                                            window.innerWidth / window.innerHeight,
                                            1, 10000);
  this.camera.position.z = 650;
  this.camera.lookAt(this.threeScene);
  this.camera.lastPosition = this.camera.position.clone();
  this.threeResize = new THREEx.WindowResize(this.renderer, this.camera);
};

Scene.prototype.run = function() {
  if (this.isRendering && this.requestId) {
    return;
  }
  this.isRendering = true;
  $('body').prepend(this.canvas);
  this.attachCanvas(this.canvas);
  this.animate();
};

Scene.prototype.destroy = function() {
  if (this.requestId) {
    this.isRendering = false;
    cancelAnimationFrame(this.requestId);
    this.threeResize.destroy();
    this.requestId = null;
    this.renderer.clear();
    $('#threeCanvas').remove();
  }
};

Scene.prototype.stopRender = function() {
  this.isRendering = false;
};

Scene.prototype.resumeRender = function() {
  this.isRendering = true;
};

Scene.prototype.animate = function(time) {
  if (this.isRendering === false) {
    return;
  }
  this.render(time);
  this.requestId = requestAnimationFrame(this.animate.bind(this));
};

Scene.prototype.render = function(time) {
  var delta = this.clock.getDelta();
  // console.log(delta);
  if (_.isObject(this.focusObj)) {
    var position;
    if (this.focusObj instanceof THREE.Mesh) {
      position = this.focusObj.position;
    } else if (this.focusObj instanceof SceneObject) {
      position = this.focusObj.threeBody.position;
    }
    this.camera.position.setX(position.x);
    this.camera.position.setY(position.y - 64*4);
    this.camera.lookAt(position);
    this.camera.rotation.x = 25 * Math.PI / 180;
    if (_.isFunction(this.focusObj.onCameraPositionChange) &&
        !this.camera.lastPosition.equals(this.camera.position)) {
      this.focusObj.onCameraPositionChange(this.camera);
    }
    this.camera.lastPosition.copy(this.camera.position);
  }
  this.cpSpace.step(delta);
  _.each(this.sceneObjects, function(sb) {
    if (_.isFunction(sb.afterUpdate)) {
      sb.afterUpdate(delta);
    }
    sb.syncCpAndThree();
  });
  this.renderer.render(this.threeScene, this.camera);
};
