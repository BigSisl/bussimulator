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
var Target = require('./simulator/Target.js');
var Save = require('./simulator/builder/Save.js');
var Message = require('./simulator/Message.js');
var Package = require('./simulator/Package.js');

var $ = require('jquery');

module.exports = (function(){

  var self = {};

  /**
   * Canvas object used for drawing all elements
   * @type {fabric}
   */
  var canvas = null;

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

  var procentage = 1;

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

  self.load = function(url, cb) {
    var count = 0;

    Save.loadFromServer(url + 'lines.json', 'local.lines', function() {
      if(count++ >= 1) {
        cb();
      }
    });
    Save.loadFromServer(url + 'stops.json', 'local.stops', function() {
      if(count++ >= 1) {
        cb();
      }
    });

  };

  self.start = function(map) {
    gui = global.gui = new GUI(map);
    canvas = gui.getCanvas();
    var MapObj = gui.getActiveMap();

    procentage = $(window).width() / $('#canvas-simulator').width();

    $('.canvas-container').css({
        'zoom': procentage
    });

    // setup application / bootstrap map
    this.load(MapObj.url, function() {
        // load
        stops = StopEditor.load(canvas);
        lines = LineEditor.load(canvas, stops);

        simulator = new Simulator(stops, lines)

        self.draw();
    });
  };

  self.draw = function() {
    gui.drawLegend(lines);
  };

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
    setHub: function() { StopEditor.setHub(canvas, stops); },
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

  self.GetMap = function() {
    console.log(
      JSON.stringify(Save.get('local.stops'))
    );
    console.log(
      JSON.stringify(Save.get('local.lines'))
    )
  };

  self.Calc = function(stop1, stop2) {

    // TMP
    var start = stops[stop1];
    var end = stops[stop2];

    var result = simulator.getPath(start, end);

    console.log('POS: ', start.getId(), '');
    $.each(result, function(i, el) {
      console.log('POS: ', el.stop.getId(), el.line.getId());
    });

    result.unshift({
      stop: start,
      line: null
    });
    gui.animateBus(result);

  }

  /**
   * Activate Production mode
   * @param {[type]} active [description]
   */
  self.Prod = function(active) {
    if(active) {
      $.each(lines, function(i, el) {
        el.setSelectable(false);
      });

      Target.listen(canvas, function(target) {
        target.stop = StopClass.findClosestStop(stops, target.getPos());

        if(target.stop) {
          var result = simulator.getPathByTarget(target);

          target.setPackage(new Package());

          gui.animateBus(result);
          // find closest stop
          console.log(result);
        } else {
          target.remove(canvas);
          Message.error('Ziel ist nicht erreichbar');
        }
      });
    } else {
      $.each(lines, function(i, el) {
        el.setSelectable(false);
      });

      el.getPath().set({
        selectable: true
      });

      Target.stop(canvas);
    }
  }

  self.Save = function() {
    LineEditor.save(lines);
    StopEditor.save(stops);
  }

  return self;
})();
