/**
 * Bootstraps the applicaion
 */

var StopClass = require('./simulator/Stops.js');
var LineClass = require('./simulator/Lines.js');
var StopEditor = require('./simulator/builder/StopsEditor.js');
var LineEditor = require('./simulator/builder/LineEditor.js');
var Simulator = require('./simulator/simulator.js');
var fabric = require("fabric-browserify").fabric;
var GUI = require("./simulator/Gui.js");

var $ = require('jquery');

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

  /**
   * Reference to the actual simulator
   * @type {[type]}
   */
  var simulator = null;

  /**
   * Reference to the gui class
   * @type {[type]}
   */
  var gui = null;

  self.start = function() {
    // load
    stops = StopEditor.load(canvas);
    lines = LineEditor.load(canvas, stops);

    gui = global.gui = new GUI(canvas);

    simulator = new Simulator(stops, lines)

    self.draw();
    // setup application / bootstrap application
  }

  self.draw = function() {
    gui.drawLegend(lines);
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
    list: function() { return stops; },
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
    list: function() { return lines; },
    stop: function() { LineEditor.stop(); }
  }

  self.Calc = function(stop1, stop2) {

    // TMP
    var start = stops[stop1];
    var end = stops[stop2];

    var result = simulator.getPath(start, end);

    console.log('POS: ', start.getId(), '');
    $.each(result, function(i, el) {
      console.log('POS: ', el.stop.getId(), el.line.getId());
    });
  }

  self.Save = function() {
    LineEditor.save(lines);
    StopEditor.save(stops);
  }

  return self;
})();
