var _ = require('lodash');
var $ = require('jquery/dist/jquery');
var THREE = require('three');
var React = require('react');
var View = require('./View');
var IDBStore = require('idb-wrapper');
var Buzz = require('node-buzz');

var Loader = module.exports =  function (option) {
  this.world = null;
  this.isLoading = false;
  this.hasLoaded = false;
  this.numTotalItem = 0;
  this.numItem = 0;
  this.clientAssetsList = null;
  this.assetsStore = null;
  if (option) {
    this.onComplete = option.onComplete;
  }
};

Loader.prototype.run = function(onComplete) {
  if (this.hasLoaded) {
    return;
  }
  this.world.views.loading =
    React.renderComponent(View.Loading(null),
                          document.body);
  this.isLoading = true;
  $.getJSON('assets/json/ClientAssetsList.json', function(syncList) {
    this.clientAssetsList = syncList;
    _.each(syncList, function(val) {
      this.numTotalItem += _.size(val);
    }, this);
    console.log('this.clientAssetsList: ',this.clientAssetsList);
    this.assetsStore = new IDBStore({
      dbVersion: 1,
      storeName: 'assets',
      keyPath: 'id',
      autoIncrement: false,
      onStoreReady: this.handleReadyAssetsStore.bind(this)
    });
  }.bind(this));
};


Loader.prototype.handleReadyAssetsStore = function() {
  console.log('indexeddb open!');
  if (_.isUndefined(this.clientAssetsList) ||
      _.isNull(this.clientAssetsList)) {
    return;
  }
  var assetsStore = this.assetsStore;
  var world = this.world;
  var loader = this;
  _.each(this.clientAssetsList, function(val, assetsType) {
    _.each(val, function(asset, key) {
      assetsStore.get(assetsType + '-' + key, function(result) {
        if (!_.isUndefined(result) && (result.md5 == asset.md5)) {
          console.log("asset retrieve from indexeddb");
          console.log('result:', result);
          loader.putToWorld(assetsType, result, key);
          loader.updateProgress();
        } else {
          var xhr = new XMLHttpRequest(),
              blob;
          xhr.open("GET", asset.url, true);
          xhr.responseType = "blob";
          xhr.addEventListener("load", function () {
            if (xhr.status === 200) {
              console.log("asset retrieve from xhr");
              blob = xhr.response;
              asset.id = assetsType + '-' + key;
              asset.blob = blob;
              console.log(blob);
              assetsStore.put(asset);
              loader.putToWorld(assetsType, asset, key);
            } else {
              console.log('error download client assets');
            }
            loader.updateProgress();
          }, false);
          xhr.send();
        }
      });
    });
  });
};

Loader.prototype.putToWorld = function(assetsType, asset, key) {
  if (assetsType == 'image') {
    var tagName = 'img';
    this.world.assets[assetsType][key] = blob2DOM(asset.blob, tagName);
  } else if (assetsType == 'audio') {
    this.world.assets[assetsType][key] = blob2audio(asset.blob);
  }
};

Loader.prototype.updateProgress = function() {
  this.numItem += 1;
  if (this.numItem == this.numTotalItem) {
    this.handleComplete();
    return;
  }
  this.world.views.loading.handleProgress(this.numItem,
                                          this.numTotalItem);
};

Loader.prototype.handleComplete = function() {
  if (this.hasLoaded) {
    return;
  }
  this.hasLoaded = true;
  React.unmountComponentAtNode(document.body);
  this.world.views.loading = null;
  this.world.views.login =
    React.renderComponent(View.Login({world: this.world}),
                          document.body);
  var geometry = new THREE.BoxGeometry( 64, 64, 64 );
  var material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true} );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.z = 32;
  this.world.assets.mesh[0] = cube;
  if (_.isFunction(this.onComplete)) {
    this.onComplete();
  }
};

function blob2DOM(blob, tagName) {
  var URL = window.URL || window.webkitURL;
  var imgURL = URL.createObjectURL(blob);
  var dom = document.createElement(tagName);
  dom.setAttribute("src", imgURL);
  return dom;
}

function blob2audio(blob) {
  var URL = window.URL || window.webkitURL;
  var audioURL = URL.createObjectURL(blob);
  var audio = new Buzz.sound(URL.createObjectURL(blob));
  return audio;
}
