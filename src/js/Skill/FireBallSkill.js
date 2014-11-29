var FireBallSkill = module.exports = function () {
  this.afterUseDuration = 0;
  this.delayDuration = 1;
};

FireBallSkill.prototype.checkDelayDuration = function() {
  if (this.afterUseDuration < this.delayDuration) {
    return false;
  } else {
    this.afterUseDuration = 0;
  }
  return true;
};
