var React = require('react');
var View = require('./View');
var _ = require('lodash');

var Account = module.exports = function (world, config) {
  this.username = null;
  this.world = world;
  this.chars = [];
  this.usingChar = null;
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Account.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "username":
      this.username = val;
      break;
    case "charConfigs":
      _.each(val, function(charConfig) {
        var char = this.world.create.Char(this, charConfig);
        this.chars[char.slotIndex] = char;
      }.bind(this));
      break;
    case "charConfig":
      var char = this.world.create.Char(this, val);
      this.chars[char.slotIndex] = char;
      if (_.isObject(this.world.views.selectChar)) {
        this.world.views.selectChar.forceUpdate();
      }
    case "usingChar":
      this.usingChar = this.chars[val];
    }
  }.bind(this));
};

// send clientcall to sever methods

Account.prototype.loginChar = function(charSlot) {
  var clientCall = {
    receiver: "Account",
    method:  "LoginChar",
    params: [charSlot]
  };
  this.world.conn.sendJSON(clientCall);
};

Account.prototype.createChar = function(name) {
  var clientCall = {
    receiver: "Account",
    method:  "CreateChar",
    params: [name]
  };
  this.world.conn.sendJSON(clientCall);
};

Account.prototype.logout = function() {
  var clientCall = {
    receiver: "Account",
    method: "Logout",
    params: []
  };
  this.world.conn.sendJSON(clientCall);
};

// recevie from server methods

Account.prototype.handleSuccessLoginChar = function(config) {
  this.usingChar = this.chars[config.usingChar];
};

Account.prototype.handleSuccessCreateChar = function(config) {
  this.parseConfig(config);
};

Account.prototype.handleErrorCreateChar = function(err) {
  alert(err);
};
