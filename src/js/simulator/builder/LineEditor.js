var fabric = require('fabric-browserify').fabric;
var jq = require('jquery');
var Events = require('../../helper/Event.js')
var LineClass = require('../Lines.js');
var Save = require('./Save.js');

var LineEditorMode = function(line, stops, canvas) {

  var self = {};
  var events = new Events(canvas);
  var activeLine = line;

  function init() {
    canvas.setActiveObject(activeLine.getPath());
    activeLine.getPath().bringToFront();
    events.add('object:selected', function(evt) {
      jq.each(stops, function(i, stop) {
        if(stop.getCircle() === evt.target) {
          if(stop.toggleLine(line)) {
            line.addStop(stop);
          } else {
            line.removeStop(stop);
          }
          line.draw(canvas);
        }
      });
    });
  };

  self.remove = function(){
    activeLine.setPos({
      x: activeLine.getPath().getLeft(),
      y: activeLine.getPath().getTop()
    });
    events.removeAll();
  };

  init();
  return self;
}

module.exports = (function() {
  const STORAGE_NAME = 'local.lines';

  var activeMode = null;

  self.edit = function(line, stops, canvas) {
    self.stop();
    activeMode = new LineEditorMode(line, stops, canvas);
  }

  self.stop = function() {
    if(activeMode && activeMode.remove) {
      activeMode.remove();
    }
  }

  self.isEditMode = function(){
    return LineEditorMode === null;
  }

  self.save = function(lines) {
    var json = [];
    for(key in lines) {
      json.push('"' + key + '": ' + lines[key].getJSON());
    }
    Save.set(STORAGE_NAME, '{' + json.join(',') + '}');
  }

  self.load = function(canvas, stops) {
    var lines = [];
    var loaded = Save.get(STORAGE_NAME);
    for(key in loaded) {
      lines[key] = new LineClass(loaded[key], stops);
      lines[key].draw(canvas);
    }

    return lines;
  }

  return self;
})();
