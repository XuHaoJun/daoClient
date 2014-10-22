var _ = require('lodash');
var Bio = require('./Bio.js');

var Npc = module.exports = function (world, config) {
  Bio.call(this, world);
  this.on("click", this.handleClick.bind(this));
  if (_.isObject(config)) {
    this.parseConfig(config);
  }
};

Npc.prototype = Object.create(Bio.prototype);

Npc.prototype.parseConfig = function(config) {
  _.each(config, function(val, key) {
    switch (key) {
    case "bioConfig":
      Bio.prototype.parseConfig.call(this, val);
      break;
    }
  }, this);
};

Npc.prototype.handleClick = function(event) {
  if (document.body.style.cursor == "pointer") {
    document.body.style.cursor = "";
  }
  var char = event.char;
  char.talkNpcById(this);
};
