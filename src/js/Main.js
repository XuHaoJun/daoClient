"use strict";

var World = require('./World.js');

window.onload = function() {
  var dao = new World();
  dao.run();
};
