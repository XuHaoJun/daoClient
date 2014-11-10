"use strict";

var World = require('./World.js');

window.onload = function() {
  var dao = new World();
  dao.run();
  window.dao = dao;
};

// dao.once('connOnopen', function() {
//   this.loginAccount("wiwi", "wiwi");
// }.bind(dao));
// dao.once('handleSuccessLoginAcccount', function() {
//   this.account.loginChar(0);
//   this.account.once('handleSuccessLoginChar', function() {
//     window.c = this.account.usingChar;
//   }.bind(this));
// }.bind(dao));

// var cp = require('chipmunk');
// window.cp = cp;
