/**
 * Editor class, enables editing, of the stops
 */

var fabric = require('fabric-browserify').fabric;
var jq = require('jquery');
var Events = require('../../helper/Event.js')
var StopClass = require('../Stops.js');

var EditType = function(canvas, stops) {
  var self = {};

  console.log(canvas, stops, 'enable editing');

  self.remove = function() {
    console.log('stop move command');
  };

  return self;
}

/**
 * Adds an add functionality to the factory object,
 * helps to add Stops
 * @param {[type]} canvas [description]
 * @param {Function} cb Callback function to send the stops information
 */
var AddType = function(canvas, cb) {
  var self = {};

  var events = new Events(canvas);
  var element = jq(canvas.wrapperEl);

  // prepare type -> smarter way to do this
  (function(canvas){
    events.add('mouse:down', function(evt) {
      cb(new StopClass({
        pos: {
          top: evt.e.y - element.offset().top,
          left: evt.e.x - element.offset().left
        }
      }));
    });
  })(canvas);

  /**
   * Always called after this edit type is finished
   * @return {[type]} [description]
   */
  self.remove = function() {
    events.removeAll();
  }

  return self;
};

module.exports = (function() {
  var self = {};

  var active = null;

  self.Types = {
    ADD: AddType,
    REMOVE: -1,
    EDIT: EditType
  };

  /**
   * Starts Stops editor
   * @param  {[type]} canvas [description]
   * @param  {Type|Integer} type  what editor type needs to active
   * @return {[type]}        [description]
   */
  var start = function(type, canvas, cb) {
    type = type ? type : self.Types.ADD;

    self.stop();

    active = new type(canvas, cb);
  };

  /**
   * Active adding stops
   * @param canvas Link to the fabric canvas object
   * @param cb Callback function with added stop as parameter
   */
  self.add = function(canvas, cb) {
    start(self.Types.ADD, canvas, cb);
  };

  /**
   * Enables editing
   * @param  {[type]} canvas [description]
   * @param  {[type]} stops  [description]
   * @return {[type]}        [description]
   */
  self.edit = function(canvas, stops) {
    self.stop();
    active = new self.Types.EDIT(canvas, stops);
  }

  /**
   * Saves changes
   * @return {[type]} [description]
   */
  self.save = function(stops) {
    console.log('save stop');
  };

  /**
   * Stop edit mode
   * @return {[type]} [description]
   */
  self.stop = function() {
    if(active && active.remove) {
      active.remove();
    }
  };

  return self;
})();
