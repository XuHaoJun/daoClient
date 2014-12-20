var THREE = require('n3d-threejs');
var EventEmitter = require('eventemitter3').EventEmitter;

// from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Sprite-Text-Labels.html

// http://jsfiddle.net/J5d7h/11/

var TextSprite = module.exports = function (message, parameters) {
  EventEmitter.call(this);
  this.canvas = null;
  this.message = message;
  this.parameters = parameters;
  this.threeBody = this.initThreeBody(message, {});
};

TextSprite.prototype = Object.create(EventEmitter.prototype);

TextSprite.prototype.setBackgroundColor = function(backgroundColor) {
  // this.parameters["backgroundColor"] = backgroundColor;
  // this.newSpriteMaterial(this.message, this.parameters);
  // var  spriteMaterial = this.newSpriteMaterial(this.message, this.parameters);
  // this.threeBody.material = spriteMaterial;
  console.log("wiwi");
};

TextSprite.prototype.newSpriteMaterial = function(message, parameters) {

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
  this.canvas = canvas;
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
  // context.textAlign = "center";
  // context.textBaseline = "middle";

  // get size data (height depends only on font size)
  var metrics = context.measureText( message );
  var textWidth = metrics.width;
  if (parameters["width"]) {
    canvas.width = parameters["width"];
  } else {
    canvas.width = textWidth + 3;
  }
  if (parameters["height"]) {
    canvas.height = parameters["height"];
  } else {
    canvas.height = fontsize + 3;
  }

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

  // var spriteMaterial = new THREE.SpriteMaterial(
  //   { map: texture } );
  // var spriteMaterial = new THREE.MeshBasicMaterial(
  //   { map: texture });
  return texture;
}

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

TextSprite.prototype.threeMaterial = function(text, params) {
  var font = "Arial",
      size = 130,
      color = "#676767";
  var padding = 10;

  font = "bold " + size + "px " + font;

  var canvas = document.createElement('canvas');
  this.canvas = canvas;
  var context = canvas.getContext('2d');
  context.font = font;

  // get size data (height depends only on font size)
  var metrics = context.measureText(text),
      textWidth = metrics.width;

  canvas.width = textWidth + 3;
  canvas.height = size + 4;

  context.font = font;
  context.fillStyle = color;
  context.fillText(text, 0, size + 4);
  //context.style.border="3px solid blue";

  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return new THREE.MeshBasicMaterial({map: texture});
};

TextSprite.prototype.initThreeBody = function(text, params) {
  var material = this.threeMaterial(text, params);
  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(this.canvas.width, this.canvas.height),
    material
  );
  return mesh;
};
