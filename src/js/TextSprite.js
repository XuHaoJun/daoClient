var THREE = require('n3d-threejs');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

// from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Sprite-Text-Labels.html

// http://jsfiddle.net/J5d7h/11/

var TextSprite = module.exports = function (message, parameters) {
  EventEmitter2.call(this);

  if ( parameters === undefined ) parameters = {};

  var fontface = parameters.hasOwnProperty("fontface") ?
        parameters["fontface"] : "Arial";

  var fontsize = parameters.hasOwnProperty("fontsize") ?
        parameters["fontsize"] : 18;

  var borderThickness = parameters.hasOwnProperty("borderThickness") ?
        parameters["borderThickness"] : 4;

  var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

  var canvas = document.createElement('canvas');
  if (parameters["width"]) {
    canvas.width = parameters["width"];
  }
  if (parameters["height"]) {
    canvas.height = parameters["height"];
  }
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
  // context.textAlign = "center";
  // context.textBaseline = "middle";

  // get size data (height depends only on font size)
  var metrics = context.measureText( message );
  var textWidth = metrics.width;

  // background color
  context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    + backgroundColor.b + "," + backgroundColor.a + ")";
  // border color
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
    + borderColor.b + "," + borderColor.a + ")";
  context.lineWidth = borderThickness;
  roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  // 1.4 is extra height factor for text below baseline: g,j,p,q.

  // text color
  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  context.fillText( message, borderThickness, fontsize + borderThickness);

  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.SpriteMaterial(
    { map: texture } );
  var sprite = new THREE.Sprite( spriteMaterial );
  // sprite.scale.set(100,50,1.0);

  this.threeBody = sprite;
  this.context = context;
  this.canvas = canvas;
};

TextSprite.prototype = Object.create(EventEmitter2.prototype);

TextSprite.prototype.setBackgroundColor = function(backgroundColor) {
  this.context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    + backgroundColor.b + "," + backgroundColor.a + ")";
};

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r)
{
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
