var CleaveSkill = module.exports = function () {
  this.afterUseDuration = 0;
  this.delayDuration = 0.6;
};

CleaveSkill.prototype.checkDelayDuration = function() {
  if (this.afterUseDuration < this.delayDuration) {
    return false;
  } else {
    this.afterUseDuration = 0;
  }
  return true;
};
