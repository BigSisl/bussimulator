/**
 * Bootstraps the applicaion
 */

var StopClass = require('./simulator/Stops.js');
var StopEditor = require('./simulator/builder/StopsEditor.js');
var fabric = require("fabric-browserify").fabric;

module.exports = (function(){

  var self = {};

  /**
   * Canvas object used for drawing all elements
   * @type {fabric}
   */
  var canvas = new fabric.Canvas('canvas-simulator');

  /**
   * Array of all stops -> immutable?
   * @type {Array}
   */
  var stops = [];

  self.start = function() {
    console.log('heyho');
    self.draw();
    // setup application / bootstrap application
  }

  self.draw = function() {
    var stop = new StopClass();

    stop.draw(canvas);
  }

  /**
   * Activate editor in commandline
   * @return {[type]} [description]
   */
  self.stopEditor = {
    add: function() {
      StopEditor.add(canvas, function(stop) {
        // callback
        console.log('added stop', stop);
      })
    },
    stop: function() { StopEditor.stop(); },
    edit: function() {
      
    }
  };

  self.LineEditor = {
    connect: function() {
      // enable connections
    }
  }

  return self;
})();
