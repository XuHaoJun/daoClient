var $ = require('jquery/dist/jquery');
var World = require('./World.js');

$(function () {
  var dao = new World();
  dao.run();
  window.dao = dao;
});
