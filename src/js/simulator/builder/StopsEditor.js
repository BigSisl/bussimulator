/**
 * Editor class, enables editing, of the stops
 */

var fabric = require('fabric-browserify').fabric;
var jq = require('jquery');
var Events = require('../../helper/Event.js')
var StopClass = require('../Stops.js');
var Save = require('./Save.js');

var EditType = function(canvas, stops) {
  var self = {};
  var oldConfig = {

  }; // contains old config to recreate from

  /**
   * Change status of object, depending on if edited
   * @param  {[type]} edit true -> enable edit / -> false -> lock object
   * @return {[type]}      [description]
   */
  function edit(edit, circle) {
      circle.lockMovementX = !edit;
      circle.lockMovementY = !edit;
  }

  (function() {
    jq.each(stops, function(i, stop) {
      edit(true, stop.getCircle());
    });
  })();

  self.remove = function() {
    jq.each(stops, function(i, stop) {
      // save current position to the stops
      stop.update();
      edit(false, stop.getCircle());
    });
  };

  return self;
}

var SetHubType = function(canvas, stops) {
  var events = new Events(canvas);

  (function(canvas){
    events.add('object:selected', function(evt) {
      // find object by comparing the position
      var index = -1;
      jq.each(stops, function(i, stop) {
        if(evt.target === stop.getCircle()) {
          stop.isHub(true);
        } else {
          stop.isHub(false);
        }

        if(stop.isHub()) {
          console.log(stop);
        }
      });

      if (index > -1) {
        stops.splice(index, 1);
      }
    });
  })(canvas);

 self.remove = function() {
   events.removeAll();
 }
}

var RemoveType = function(canvas, stops) {
  var events = new Events(canvas);

  (function(canvas){
    events.add('object:selected', function(evt) {
      // find and remove selected
      console.log(evt);

      // find object by comparing the position
      var index = -1;
      jq.each(stops, function(i, stop) {
        if(evt.target === stop.getCircle()) {
          stop.remove(canvas);
          index = i;
        }
      });

      if (index > -1) {
        stops.splice(index, 1);
      }

      console.log(stops);
    });
  })(canvas);

  /**
   * Always called after this edit type is finished
   * @return {[type]} [description]
   */
  self.remove = function() {
    console.log('remove events');
    events.removeAll();
  }

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
  const STORAGE_NAME = 'local.stops';

  var self = {};

  var active = null;

  self.Types = {
    ADD: AddType,
    REMOVE: RemoveType,
    EDIT: EditType,
    SETHUB: SetHubType
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

  self.setHub = function(canvas, stops) {
    self.stop();
    active = new self.Types.SETHUB(canvas, stops);
  }

  /**
   * Saves changes
   * @return {[type]} [description]
   */
  self.save = function(stops) {
    self.stop();

    var save = jq.map(stops, function(stop, i) {
      return stop.getJSON();
    });

    Save.set(STORAGE_NAME, '[' + save.join(',') + ']');
  };

  self.load = function(canvas) {
    //TODO: removeAll
    var stops = [];

    jq.each(Save.get(STORAGE_NAME), function(i, config){
      var stop = new StopClass(config);
      stops.push(stop);
      stop.draw(canvas);
    });

    console.log('stops: ', stops);
    return stops;
  }

  self.remove = function(canvas, stops) {
    self.stop();
    active = new self.Types.REMOVE(canvas, stops);
  }

  /**
   * Stop edit mode
   * @return {[type]} [description]
   */
  self.stop = function() {
    console.log('stop edit');
    if(active && active.remove) {
      active.remove();
    }
  };

  return self;
})();
