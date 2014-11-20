require('browsernizr/test/websockets');
require('browsernizr/test/indexedDB');
require('browsernizr/test/webgl');
require('browsernizr/test/audio');
require('browsernizr/test/draganddrop');
require('browsernizr/test/requestanimationframe');
require('browsernizr/test/blob');
require('browsernizr/test/json');
var THREE = require('n3d-threejs');
var Modernizr = require('browsernizr');
var isNode = require('detect-node');
var _ = require('lodash');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var React = require('react');
var View = require('./View');
var ObjectCreator = require('./ObjectCreator.js');

var World = module.exports = function (config) {
  EventEmitter2.call(this);
  this.scenes = {};
  this.assets  = {image: {}, audio: {},
                  geometry: {}, texture: {},
                  mesh: {}, itemIcon: {}, skillIcon: {}};
  this.isGaming = false;
  this.account = null;
  this.serverList = {
    main: (location.hostname + ":"  + (parseInt(location.port)+1)),
    default: (location.hostname + ":"  + (parseInt(location.port)+1))
  };
  if (isNode) {
    this.serverList.main = "127.0.0.1:3000";
  }
  this.create = new ObjectCreator(this);
  this.initConn();
  this.initLastErrors();
  this.initViews();
  this.initThreeCanvas();
  this.loader = this.create.Loader();
  this.loader.once('complete', function() {
    this.conn.once('onopen', function() {
      this.emit("connOnopen");
    }.bind(this));
    this.conn.run();
    this.emit("loadComplete");
  }.bind(this));
};

World.prototype = Object.create(EventEmitter2.prototype);

World.prototype.run = function() {
  if (this.browserDependCheck()) {
    this.loader.run();
  }
};

World.prototype.browserDependCheck =  function() {
  var checks = ['websockets', 'indexeddb', 'webgl',
                'audio', 'draganddrop', 'requestanimationframe',
                'blobconstructor', 'json'];
  var modernizrChecks = _.map(checks, function(c) { return Modernizr[c]; });
  var isPassed = _.all(modernizrChecks, function(c) { return c == true;});
  if (isPassed == false) {
    var checkResult= _.zipObject(checks, modernizrChecks);
    this.initViews();
    React.unmountComponentAtNode(document.body);
    React.render(View.BrowserDependCheck({checkResult: checkResult}),
                          document.body);
  }
  return isPassed;
};

World.prototype.initConn = function() {
  this.conn = this.create.Conn("ws://" + this.serverList.main + "/daows");
};

World.prototype.initViews = function() {
  this.views = {
    selectChar: null, game: null,
    login: null, loading: null
  };
};

World.prototype.initLastErrors = function() {
  this.lastErrors = {errorLoginAccount: null,
                     errorRegisterAccount: null};
};

World.prototype.initThreeCanvas = function() {
  this.threeCanvas = document.createElement('canvas');
  this.threeCanvas.id = 'threeCanvas';
  this.threeCanvas.unselectable = 'on';
  this.threeCanvas.onselectstart = function(event) {
    return false;
  };
  this.threeCanvas.oncontextmenu = function(event) {
    return false;
  };
  this.renderer = new THREE.WebGLRenderer({canvas: this.threeCanvas});
  this.renderer.shadowMapEnabled = true;
};

// following method for send to server

World.prototype.loginAccount = function(username, password) {
  var clientCall = {
    receiver: "World",
    method: "LoginAccount",
    params: [username, password]
  };
  this.conn.sendJSON(clientCall);
};

World.prototype.registerAccount = function(username, password) {
  var clientCall = {
    receiver: "World",
    method: "RegisterAccount",
    params: [username, password]
  };
  this.conn.sendJSON(clientCall);
};

World.prototype.handleDisconnect = function() {
  if (_.isObject(this.account) &&
      _.isObject(this.account.usingChar)) {
    this.account.usingChar.destroy();
    // may be remove to world scenes after scene destroy
    this.account.usingChar.scene.destroy();
  }
  this.initConn();
  this.conn.run();
  this.initLastErrors();
  this.scenes = {};
  React.unmountComponentAtNode(document.body);
  this.initViews();
  window.location.hash = "#login";
  this.views.login =
    React.render(View.Router({world: this}),
                          document.body);
  this.isGaming = false;
};

// following method for server call
World.prototype.handleErrorRegisterAccount = function(err) {
  if (_.isObject(this.views.login)) {
  }
};

World.prototype.handleAddScene = function(sceneConfig) {
  var scene = this.create.Scene(sceneConfig);
  this.scenes[sceneConfig.name] = scene;
};

World.prototype.handleSuccessLoginAcccount = function(accountConfig) {
  if (_.isObject(this.views.login)) {
    this.account = this.create.Account(accountConfig);
    React.unmountComponentAtNode(document.body);
    this.views.login = null;
    this.views.selectChar = React
      .render(View.SelectChar({world: this}),
                       document.body);
    this.emit('handleSuccessLoginAcccount', accountConfig);
  }
};

World.prototype.handleSuccessRegisterAccount = function(succesMsg) {
  if (_.isObject(this.views.login)) {
    this.views.login.handleSuccessRegisterAccount(succesMsg);
  }
};

World.prototype.handleErrorLoginAccount = function(err) {
  this.lastErrors.errorLoginAccount = err;
  if (_.isObject(this.views.login)) {
    this.views.login.handleErrorLoginAccount(err);
  }
};

World.prototype.handleRunScene = function(sceneName) {
  if (_.isObject(this.views.selectChar)) {
    React.unmountComponentAtNode(document.body);
    this.views.selectChar = null;
    this.views.game = React.render(View.Game({world: this}),
                                   document.body);
  }
  this.scenes[sceneName].run();
  this.isGaming = true;
};

World.prototype.handleDestroyScene = function(name) {
  this.scenes[name].destroy();
};
