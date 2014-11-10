var _ = require('lodash');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var React = require('react');
var View = require('./View');

var Conn = module.exports = function(world, wsurl) {
  EventEmitter2.call(this);
  this.wsurl = wsurl;
  this.world = world;
  this.sock = null;
};

Conn.prototype = Object.create(EventEmitter2.prototype);

Conn.prototype.run = function() {
  this.sock = new WebSocket(this.wsurl);
  this.sock.onclose = function(evt) {
    console.log("disconnect!");
    if (this.world.isGaming) {
      this.world.handleDisconnect();
    } else {
      alert("Disconnect!");
    }
  }.bind(this);
  this.sock.onerror = function(err) {
    console.log("socket onerror: ", err);
  };
  this.sock.onopen = function() {
    console.log('successfully connect to dao server');
    this.emit('onopen');
  }.bind(this);
  this.sock.onmessage = function(r) {
    this.handleOnmessage(r);
  }.bind(this);
};

Conn.prototype.handleOnmessage = function (r) {
  var conn = this;
  var data = JSON.parse(r.data);
  if (_.isArray(data)) {
    _.each(data, function(d) {
      conn.parse(d);
    });
  } else {
    conn.parse(data);
  }
};

Conn.prototype.sendJSON = function(obj) {
  this.sock.send(JSON.stringify(obj));
};

Conn.prototype.sendText = function(text) {
  this.sock.send(text);
};

Conn.prototype.parse = function(data) {
  // console.log(data);
  var world = this.world;
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
    return;
  }
  function LowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
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
    return;
  }
  var method = receiver[data.method];
  if (_.isUndefined(method) ||
      _.isNull(method) ||
      !_.isFunction(method)) {
    return;
  }
  if (_.isUndefined(data.params) ||
      _.isNull(data.params) ||
      (_.isArray(data.params) && data.params.length === 0)) {
    method.apply(receiver);
  } else if (_.isArray(data.params)){
    method.apply(receiver, data.params);
  }
};
