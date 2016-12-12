/**
 * Bootstraps the applicaion
 */

var StopClass = require('./simulator/Stops.js');
var LineClass = require('./simulator/Lines.js');
var StopEditor = require('./simulator/builder/StopsEditor.js');
var LineEditor = require('./simulator/builder/LineEditor.js');
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

  /**
   * Contains an array of lines.
   * @type {Array}
   */
  var lines = []

  self.start = function() {
    // load
    stops = StopEditor.load(canvas);
    lines = LineEditor.load(canvas, stops);

    self.draw();
    // setup application / bootstrap application
  }

  self.draw = function() {

  }

  /**
   * Activate editor in commandline
   * @return {[type]} [description]
   */
  self.StopEditor = {
    add:    function() {
      StopEditor.add(canvas, function(stop) {
        stops.push(stop);
        stop.draw(canvas);
      });
    },
    stop:   function() { StopEditor.stop(); },
    edit:   function() { StopEditor.edit(canvas, stops); },
    remove: function() { StopEditor.remove(canvas, stops); },
    list: function() { console.log(stops); },
    load:   function() { console.log('reload page') }
  };

  /**
   * Enables editing of buslines
   * @type {Object}
   */
  self.LineEditor = {
    edit: function(line) {
      console.log(lines, lines[line], 'lines[line]', typeof lines[line] === 'undefined');
      if(typeof lines[line] === 'undefined') {
        lines[line] = new LineClass({
          name: line
        });
      }

      lines[line].draw(canvas);
      LineEditor.edit(lines[line], stops, canvas);
    },
    list: function() { console.log(lines); },
    stop: function() { LineEditor.stop(); }
  }

  self.Save = function() {
    LineEditor.save(lines);
    StopEditor.save(stops);
  }

  return self;
})();
