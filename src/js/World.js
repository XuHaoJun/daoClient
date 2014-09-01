require('browsernizr/test/websockets');
require('browsernizr/test/indexedDB');
require('browsernizr/test/webgl');
require('browsernizr/test/audio');
require('browsernizr/test/draganddrop');
require('browsernizr/test/requestanimationframe');
require('browsernizr/test/blob');

var Modernizr = require('browsernizr');
var _ = require('lodash');
var React = require('react');
var View = require('./View');
var ObjectCreator = require('./ObjectCreator.js');

var World = module.exports = function (config) {
  this.scenes = {};
  this.assets  = {image: {}, audio: {},
                  geometry: {}, texture: {},
                  mesh: {}, icon: {}};
  this.isGaming = false;
  this.account = null;
  this.serverList = {
    main: ("ws://" + location.hostname + ":"  + location.port + "/daows")
  };
  this.create = new ObjectCreator(this);
  this.initConn();
  this.initLastErrors();
  this.initViews();
  this.initThreeCanvas();
  this.loader = this.create.Loader();
  this.loader.once('complete', function() {
    this.conn.run();
  }.bind(this));
};

World.prototype.run = function() {
  if (this.browserDependCheck()) {
    this.loader.run();
  }
};

World.prototype.browserDependCheck =  function() {
  var checks = ['websockets', 'indexeddb', 'webgl',
                'audio', 'draganddrop', 'requestanimationframe',
                'blobconstructor'];
  var modernizrChecks = _.map(checks, function(c) { return Modernizr[c]; });
  var isPassed = _.all(modernizrChecks, function(c) { return c == true;});
  if (isPassed == false) {
    var checkResult= _.zipObject(checks, modernizrChecks);
    this.initViews();
    React.unmountComponentAtNode(document.body);
    React.renderComponent(View.BrowserDependCheck({checkResult: checkResult}),
                          document.body);
  }
  return isPassed;
};

World.prototype.initConn = function() {
  this.conn = this.create.Conn(this.serverList.main);
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
    event.preventDefault();
  };
  this.threeCanvas.oncontextmenu = function(event) {
    event.preventDefault();
  };
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
    this.account.usingChar.scene.destroy();
  }
  this.initConn();
  this.conn.run();
  this.initLastErrors();
  this.scenes = {};
  React.unmountComponentAtNode(document.body);
  this.initViews();
  this.views.login =
    React.renderComponent(View.Login({world: this}),
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
      .renderComponent(View.SelectChar({world: this}),
                       document.body);
  }
};

World.prototype.handleErrorLoginAccount = function(err) {
  this.lastErrors.errorLoginAccount = err;
  if (_.isObject(this.views.login)) {
    this.views.login.handleErrorLoginAccount();
  }
};

World.prototype.handleRunScene = function(sceneName) {
  if (_.isObject(this.views.selectChar)) {
    React.unmountComponentAtNode(document.body);
    this.views.selectChar = null;
    this.views.game = React
      .renderComponent(View.Game({world: this}),
                       document.body);
  }
  this.scenes[sceneName].run();
  this.isGaming = true;
};
