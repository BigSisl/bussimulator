/**
 * Define a target
 */

var Events = require('../helper/Event.js');
var $ = require('jquery');
var fabric = require('fabric-browserify').fabric;
var Message = require('./Message.js');

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

  var started = Date.now();

  /**
   * const PACKAGE_STARTED           = global.PACKAGE_STARTED          = 0;
     const PACKAGE_CHANGEING_LINE    = global.PACKAGE_CHANGEING_LINE   = 1;
     const PACKAGE_PASSINGSTOP       = global.PACKAGE_PASSINGSTOP      = 2;
     const PACKAGE_REACHED_ENDSTOP   = global.PACKAGE_REACHED_ENDSTOP  = 3;

     const PACKAGE_WAITING_FOR_BUS   = global.PACKAGE_WAITING_FOR_BUS  = 20;
     const PACKAGE_GOT_ON_BUS        = global.PACKAGE_GOT_ON_BUS       = 10;
     const PACKAGE_WAITING_FOR_DRONE = global.PACKAGE_WAITING_FOR_DRONE= 21;
     const PACKAGE_GOT_ON_DRONE      = global.PACKAGE_GOT_ON_DRONE     = 11;
   */
  // list of all messages
  var messages = {};
  messages[PACKAGE_STARTED]         = function(pkgname, args) {
    return 'Paket ' + pkgname + ' ist auf dem Weg';
  };
  messages[PACKAGE_CHANGEING_LINE]  = function(pkgname, args) {
    return 'Paket ' + pkgname + ' wechselt nun die Line von ' +  + args[0].getId() + ' zu ' + args[1].getId();
  };
  messages[PACKAGE_REACHED_ENDSTOP]  = function(pkgname, args) {
    return 'Paket ' + pkgname + ' hat sein Ziel erreicht';
  };
  messages[PACKAGE_WAITING_FOR_BUS]  = function(pkgname, args) {
    return 'Paket ' + pkgname + ' wartet auf den Bus der Linie ' + args[0].getId();
  };
  messages[PACKAGE_WAITING_FOR_DRONE]  = function(pkgname, args) {
    return 'Paket ' + pkgname + ' wartet auf eine Drone um das Ziel direkt zu erreichen';
  };

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


    if(messages[eventTriggered]) {
      Message.log(messages[eventTriggered](pkg.packageNumber, args));
    }
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
