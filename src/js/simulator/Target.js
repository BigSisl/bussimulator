/**
 * Define a target
 */

var Events = require('../helper/Event.js');
var $ = require('jquery');
var fabric = require('fabric-browserify').fabric;

var events = null;

const LOCATION_PIN_SVG = './data/LocationPin.svg';
const OFFSET = {
  left: -18,
  top: -37
}
const SCALE = 0.3;

var Target = function(pos, canvas) {
  var self = {};

  var pin = null;

  self.draw = function(canvas) {
    canvas.remove(pin);
    canvas.add(pin);
  };

  self.remove = function(canvas) {
    canvas.remove(pin);
  };

  self.getPos = function() {
    return pos;
  };

  function constructor() {
    fabric.loadSVGFromURL(LOCATION_PIN_SVG, function(objects, options) {
      pin = fabric.util.groupSVGElements(objects, options);

      pin.set({
        left: pos.left + OFFSET.left,
        top: pos.top + OFFSET.top,
        scaleX: SCALE,
        scaleY: SCALE
      });

      self.draw(canvas);
    });
  }

  constructor();

  return self;
}

/**
 * Starts listening on clickes and creates a target when clicked
 * @param  {[type]} canvas [description]
 * @return {[type]}        [description]
 */
Target.listen = function(canvas, cb) {
  events = new Events(canvas);
  var element = $(canvas.wrapperEl);

  events.add('mouse:up', function(evt) {
    var target = new Target({
      top: evt.e.y - element.offset().top,
      left: evt.e.x - element.offset().left
    }, canvas);

    cb(target);
  });

};

Target.stop = function(canvas) {
  if(events) {
    events.removeAll();
  }
};

module.exports = Target;
