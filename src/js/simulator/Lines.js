/**
 * Class contains the Lines, generate from different Points
 */

var jq = require('jquery');
var fabric = require('fabric-browserify').fabric;

module.exports = function(config, stops) {
  var self = {};

  /**
   * Dataobject of the stop, containg all informations
   * @type {[type]}
   */
  var Line = jq.extend({
    /**
     * Name to display of the stop, this is also the id
     * @type {String}
     */
    name: '',

    /**
     * Extra information of the stop
     * @type {String}
     */
    description: '',

    /**
     * List of all position of stops
     * @type {Array}
     */
    stops: [],

    /**
     * Contains the color of the line
     * @type {[type]}
     */
    color: getRandomColor(),
  }, config);

  var Stops = [];

  var path = null;

  // generate string for line preview
  function generateString() {
    var string = 'M';

    string += jq.map(Stops, function(stop) {
      return stop.getCircle().left + ' ' +stop.getCircle().top;
    }).join('L');

    return string;
  }

  // generate random color for line
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color
  }

  // redraw the path, TMP here
  self.draw = function(canvas) {
    canvas.remove(path);
    path = new fabric.Path(generateString());

    path.set({
      fill: '',
      stroke: Line.color,
      strokeWidth: 5 ,
      opacity: 0.8,
      selectable: true
    });

    canvas.add(path);
    path.sendToBack();
  };

  self.getId = function() {
    return Line.name;
  };

  self.getPath = function() {
    return path;
  };

  self.getJSON = function() {
    return JSON.stringify(Line);
  };

  self.addStop = function(stop) {
    Stops.push(stop);
    Line.stops.push(stop.getId());
  };

  self.removeStop = function(stop) {
    var index = Stops.indexOf(stop);
    if(index >= 0) {
      Line.stops.splice(Stops.indexOf(stop.getId()), 1);
      Stops.splice(index, 1);
    }
  };


  // actual constructor
  (function() {
    // load all stops
    jq.each(stops, function(i, stop) {
      var index = Line.stops.indexOf(stop.getId());
      if(index >= 0) {
        Stops[index] = stop;
        stop.addLine(self);
      }
    });
  })();

  return self;
};
