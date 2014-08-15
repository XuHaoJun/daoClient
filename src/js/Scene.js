var _ = require('lodash');
var THREE = require('three');
var cp = require('chipmunk');
var SceneObject = require('./SceneObject.js');
var THREEx = {
  WindowResize: require('threex.windowresize').WindowResize
};

var Scene = module.exports = function (world, config) {
  this.world = world;
  this.name = '';
  this.width = 0;
  this.height = 0;
  this.ground = null;
  this.threeScene = new THREE.Scene();
  this.threeResize = null;
  this.focusObj = null;
  this.camera = null;
  this.renderer = null;
  this.requestId = null;
  this.clock = new THREE.Clock();
  this.cpSpace = new cp.Space();
  this.cpSpace.iterations = 10;
  this.wallCpShapes = [];
  this.staticShapes = [];
  // this.staticCpBodys = [];
  this.canvas = null;
  this.sceneObjects = {};
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
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
    console.log("val key", val, key);
    switch(key) {
    case "name":
    case "width":
    case "height":
      this[key] = val;
      break;
    case "staticBodys":
      _.each(val, function(body) {
        _.each(body.shapes, function(shape) {
          var realShape;
          switch (shape.type) {
          case "circle":
          case "Circle":
            realShape = new cp.CircleShape(this.cpSpace.staticBody,
                                           shape.radius,
                                           cp.v(shape.position.x,
                                                shape.position.y));
            realShape.group = shape.group;
            break;
          case "segment":
          case "Segment":
            realShape = new cp.SegmentShape(this.cpSpace.staticBody,
                                            cp.v(shape.a.x, shape.a.y),
                                            cp.v(shape.b.x, shape.b.y),
                                            shape.radius);
            realShape.group = shape.group;
            break;
          default:
            console.log("unknown shape.");
            break;
          }
          if (_.isObject(realShape)) {
            this.staticShapes.push(realShape);
          }
        }.bind(this));
      }.bind(this));
      break;
    case "run":
      run = val;
      break;
    }
  }.bind(this));
  if (this.width > 0 && this.height > 0 &&
      _.isNull(this.ground)) {
    this.setDefaultPlaneGround();
  }
  if (run === true) {
    this.run();
  }
};

Scene.prototype.setDefaultPlaneGround = function() {
  var image = this.world.assets.image.grass;
  var geometry = new THREE.PlaneGeometry(this.width, this.height);
  var material;
  if (_.isElement(image)) {
    var texture = THREE.ImageUtils.loadTexture(image.src);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 3;
    texture.repeat.y = 3;
    material  = new THREE.MeshBasicMaterial({map: texture});
  } else {
    material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
  }
  var mesh = new THREE.Mesh(geometry, material);
  this.ground = mesh;
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
  this.ground = mesh;
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
  }.bind(this));
  this.sceneObjects[sb.id] = sb;
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
  }.bind(this));
  delete this.sceneObjects[sb.id];
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
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.camera = new THREE.PerspectiveCamera(65,
                                            window.innerWidth / window.innerHeight,
                                            1, 10000);
  this.camera.position.z = 550;
  this.camera.lookAt(this.threeScene);
  var light;
  // add a ambient light
  light       = new THREE.AmbientLight( 0x020202 );
  this.threeScene.add( light );
  // add a light in front
  light       = new THREE.DirectionalLight('white', 1);
  light.position.set(0.5, 0.5, 2);
  this.threeScene.add( light );
  // add a light behind
  light       = new THREE.DirectionalLight('white', 0.75);
  light.position.set(-0.5, 2.5, -2);
  this.threeScene.add( light );
  this.threeResize = new THREEx.WindowResize(this.renderer, this.camera);
};

Scene.prototype.run = function() {
  if (this.isRendering && this.requestId) {
    return;
  }
  this.isRendering = true;
  this.attachCanvas(this.canvas);
  this.animate();
};

Scene.prototype.destroy = function() {
  this.isRendering = false;
  this.threeResize.destroy();
  if (this.requestId) {
    cancelAnimationFrame(this.requestId);
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
  if (_.isObject(this.focusObj)) {
    var position;
    if (this.focusObj instanceof THREE.Mesh) {
      position = this.focusObj.position;
    } else if (this.focusObj instanceof SceneObject) {
      position = this.focusObj.threeBody.position;
    }
    this.camera.position.set(position.x,
                             position.y - 64*3.5,
                             this.camera.position.z);
    this.camera.lookAt(position);
    this.camera.rotation.x = 25 * Math.PI / 180;
    if (_.isFunction(this.focusObj.onCameraPositionChange)) {
      this.focusObj.onCameraPositionChange(this.camera);
    }
  }
  var delta = this.clock.getDelta();
  this.cpSpace.step(delta);
  _.each(this.sceneObjects, function(sb) {
    if (_.isFunction(sb.update)) {
      sb.update(delta);
    }
    sb.syncCpAndThree();
  });
  this.renderer.render(this.threeScene, this.camera);
};
