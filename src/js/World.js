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
var $ = require('jquery/dist/jquery');
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
  this.lastUsername = "";
  this.lastPassword = "";
  this.serverList = {
    main: (location.hostname + ":"  + (parseInt(location.port)+1)),
    default: (location.hostname + ":"  + (parseInt(location.port)+1)),
    assets: (location.hostname + ":"  + location.port)
  };
  if (isNode) {
    this.serverList.main = "127.0.0.1:3001";
    this.serverList.assets = "127.0.0.1:3000";
  }
  this.create = new ObjectCreator(this);
  this.initConn();
  this.initLastErrors();
  this.initViews();
  this.initThreeCanvas();
  this.loader = this.create.Loader();
  this.loader.on('complete', function() {
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
    app: null, selectChar: null, game: null,
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
  this.conn.run();
  this.conn.once("open", function() {
    var clientCall = {
      receiver: "World",
      method: "LoginAccount",
      params: [username, password]
    };
    this.conn.sendJSON(clientCall);
    this.lastLoginUsername = username;
    this.lastLoginPassword = password;
  }.bind(this));
};

World.prototype.loginAccountBySessionToken = function(username, token) {
  this.conn.run();
  this.conn.once("open", function() {
    var clientCall = {
      receiver: "World",
      method: "LoginAccountBySessionToken",
      params: [username, token]
    };
    this.conn.sendJSON(clientCall);
    this.lastLoginUsername = username;
  }.bind(this));
};

World.prototype.loginAccountBySession = function() {
  $.getJSON("account/loginGamebySession", this.parse.bind(this));
};

World.prototype.loginAccountGame = function(username, password) {
  var form = {username: username, password: password};
  $.post("account/loginGame", form, this.parse.bind(this), "json");
};

World.prototype.handleSetLastUsername = function(username) {
  var tmp = this.lastUsername;
  this.lastUsername = username || '';
  if (this.lastUsername != tmp) {
    this.views.app.navigate("login", {trigger: true});
  }
};

World.prototype.loginAccountWeb = function(username, password) {
  var form = {username: username, password: password};
  $.post("account/loginWeb", form, this.parse.bind(this), "json");
};


World.prototype.handleWebAccountInfo = function(data) {
  console.log(data);
};

World.prototype.getWebAccountInfo = function(callback) {
  $.getJSON("account", function(data) {
    this.parse(data);
    if (callback) {
      callback(data.params[0]);
    }
  }.bind(this));
};

World.prototype.logoutWebAccount = function() {
  $.getJSON("account/logout", function(data) {
    console.log(data);
  }.bind(this));
  this.lastUsername = '';
  this.views.app.navigate("login", {trigger: true});
};

World.prototype.checkIsWebLogined = function() {
  $.getJSON("account/isLogined", function(data) {
    var tmp = this.lastUsername;
    this.lastUsername = data.username || '';
    if (this.lastUsername != tmp) {
      this.views.app.handleForceUpdate();
    }
  }.bind(this));
};

World.prototype.registerAccount = function(username, password, email) {
  var clientCall = {
    receiver: "World",
    method: "RegisterAccount",
    params: [username, password, email]
  };
  this.conn.sendJSON(clientCall);
};

World.prototype.registerAccountByAjax = function(username, password, email) {
  var form = {username: username, password: password, email: email};
  $.post("account", form, this.parse.bind(this), "json");
};

World.prototype.handleDisconnect = function() {
  if (_.isObject(this.account) &&
      _.isObject(this.account.usingChar)) {
    this.account.usingChar.destroy();
    // may be remove to world scenes after scene destroy
    this.account.usingChar.scene.destroy();
  }
  this.initConn();
  this.initLastErrors();
  this.scenes = {};
  React.unmountComponentAtNode(document.body);
  this.initViews();
  window.location.hash = "#login";
  this.views.app = React.render(View.App({world: this}),
                                document.body);
  this.isGaming = false;
};

// following method for server call
World.prototype.handleErrorRegisterAccount = function(err) {
  if (_.isObject(this.views.app)) {
  }
};

World.prototype.handleAddScene = function(sceneConfig) {
  var scene = this.create.Scene(sceneConfig);
  this.scenes[sceneConfig.name] = scene;
};

World.prototype.handleSuccessLoginAcccount = function(accountConfig) {
  if (_.isObject(this.views.app)) {
    this.account = this.create.Account(accountConfig);
    React.unmountComponentAtNode(document.body);
    this.views.app = null;
    this.views.selectChar = React
      .render(View.SelectChar({world: this}),
              document.body);
    this.emit('handleSuccessLoginAcccount', accountConfig);
  }
};

World.prototype.handleSuccessRegisterAccount = function(succesMsg) {
  if (_.isObject(this.views.app)) {
    this.views.app.handleSuccessRegisterAccount(succesMsg);
  }
};

World.prototype.handleErrorLoginAccount = function(err) {
  this.lastErrors.errorLoginAccount = err;
  if (_.isObject(this.views.app)) {
    this.views.app.handleErrorLoginAccount(err);
  }
};

World.prototype.handleRunScene = function(sceneName) {
  if (_.isObject(this.views.selectChar)) {
    React.unmountComponentAtNode(document.body);
    this.views.selectChar = null;
    this.views.game = React.render(View.Game({world: this}),
                                   document.body);
  }
  this.currentScene = this.scenes[sceneName];
  this.currentScene.run();
  this.isGaming = true;
};

World.prototype.handleDestroyScene = function(name) {
  var scene = this.scenes[name];
  delete(this.scenes, name);
  if (scene == this.currentScene) {
    this.currentScene = null;
  }
  scene.destroy();
};

function LowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

World.prototype.parse = function(data) {
  var world = this;
  var account = (world? world.account : null);
  var char = (account? account.usingChar : null);
  var scene = (char? char.scene : null);
  var receivers = {world: world,
                   account: account,
                   char: char,
                   scene: scene};
  var bio;
  if (!_.isString(data.receiver) ||
      !_.isString(data.method)) {
    return null;
  }
  data.receiver = LowerCaseFirstLetter(data.receiver);
  var receiver;
  if (data.receiver == "bio") {
    if (_.isObject(scene)) {
      bio = scene.sceneObjects[data.params[0]];
      receiver = bio;
      data.params.shift();
      // console.log(data);
      // console.log(bio);
    }
  } else {
    receiver = receivers[data.receiver];
  }
  if (_.isNull(receiver) || _.isUndefined(receiver)) {
    return null;
  }
  var method = receiver[data.method];
  if (_.isUndefined(method) ||
      _.isNull(method) ||
      !_.isFunction(method)) {
    return null;
  }
  if (_.isUndefined(data.params) ||
      _.isNull(data.params) ||
      (_.isArray(data.params) && data.params.length === 0)) {
    method.apply(receiver);
  } else if (_.isArray(data.params)){
    method.apply(receiver, data.params);
  }
  return {receiver: receiver,
          method: method,
          params: data.params};
};
