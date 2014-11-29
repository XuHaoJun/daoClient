var _ = require('lodash');
var cp = require('chipmunk');

exports.cpShape = parseCpShapeClient;

exports.cpBody = parseCpBodyClient;

function parseCpBodyClient(bodyClient) {
  var cpBody = new cp.Body(bodyClient.mass,
                           Infinity);
  cpBody.shapes = [];
  _.each(bodyClient.shapes, function(shape) {
    var cpShape = parseCpShapeClient(shape, cpBody);
    cpBody.shapes.push(cpShape);
  });
  if (bodyClient.position) {
    cpBody.setPos(cp.v(bodyClient.position.x,
                       bodyClient.position.y));
  }
  if (bodyClient.velocity) {
    cpBody.setVel(cp.v(bodyClient.velocity.x,
                       bodyClient.velocity.y));
  }
  if (bodyClient.angle) {
    cpBody.setAngle(bodyClient.angle);
  }
  return cpBody;
}

function parseCpShapeClient(shape, body) {
  var realShape;
  switch (shape.type) {
  case "circle":
  case "Circle":
    realShape = new cp.CircleShape(body,
                                   shape.radius,
                                   cp.v(shape.position.x,
                                        shape.position.y));
    break;
  case "box":
  case "Box":
    realShape = new cp.CircleShape(body,
                                   shape.width,
                                   shape.height);
    break;
  case "segment":
  case "Segment":
    realShape = new cp.SegmentShape(body,
                                    cp.v(shape.a.x, shape.a.y),
                                    cp.v(shape.b.x, shape.b.y),
                                    shape.radius);
    break;
  default:
    console.log("unknown shape.");
    break;
  }
  realShape.sensor = shape.sensor;
  if (_.isObject(realShape)) {
    realShape.group = shape.group;
    realShape.layers = shape.layer;
    return realShape;
  } else {
    return null;
  }
}
