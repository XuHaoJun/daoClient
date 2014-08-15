var _ = require('lodash');
var React = require('react');
var View = require('./View');
var ObjectCreator = require('./ObjectCreator.js');

var World = module.exports = function (config) {
  this.create = new ObjectCreator(this);
  this.scenes = {};
  this.assets  = {image: {}, audio: {},
                  geometry: {}, texture: {},
                  mesh: {}};
  this.account = null;
  this.initConn();
  this.initLastErrors();
  this.initViews();
  var world = this;
  this.loader = this.create.Loader({
    onComplete: function () {
      world.conn.run();
    }
  });
};

World.prototype.run = function() {
  this.loader.run();
};

World.prototype.initConn = function() {
  this.conn = this.create.Conn("ws://" + location.hostname + ":"  +
                               location.port + "/daows");
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

World.prototype.handleLogout = function() {
  location.reload();
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
  this.account = this.create.Account(accountConfig);
  React.unmountComponentAtNode(document.body);
  this.views.login = null;
  this.views.selectChar = React
    .renderComponent(View.SelectChar({world: this}),
                     document.body);
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
};
