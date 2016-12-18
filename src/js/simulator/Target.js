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

  var removed = false;

  var pkg = null;

  self.draw = function(canvas) {
    if(!removed) {
      canvas.remove(pin);
      canvas.add(pin);
    }
  };

  self.remove = function(canvas) {
    removed = true;
    canvas.remove(pin);
  };

  self.readd = function() {
    removed = false;
    self.draw(canvas);
  }

  self.on = function(eventTriggered, args) {
    console.log(eventTriggered,args);
  }

  self.setPackage = function(_pkg) {
    pkg = _pkg;
  }

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
      top: evt.e.y - element.offset().top + $(document).scrollTop(),
      left: evt.e.x - element.offset().left + $(document).scrollLeft()
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
