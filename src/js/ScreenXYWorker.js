var THREE = require('n3d-threejs');

module.exports = function(self) {
  self.addEventListener('message', function(event) {
    var camera = event.data.camera;
    var matrixWorld = event.data.matrixWorld;
    var width = event.data.width, height = event.data.height;
    var widthHalf = width / 2, heightHalf = height / 2;
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(matrixWorld);
    vector.project(camera);
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;
    self.postMessage({id: event.data.id, x: vector.x, y: vector.y});
  });
};
