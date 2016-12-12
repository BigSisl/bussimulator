
var fabric

var MoveType = function(canvas, cb) {
  var self = {};

  self.remove = function() {

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

  // prepare type -> smarter way to do this
  (function(canvas){
    canvas.on('selection:cleared', function(evt) {
      console.log('deselected', evt.target);
    });
    canvas.on('object:selected', function(evt) {
      console.log('selected', evt);
    });
  })(canvas);

  /**
   * Always called after this edit type is finished
   * @return {[type]} [description]
   */
  self.remove = function() {
    console.log('removed mode');
  }

  return self;
};

module.exports = (function() {
  var self = {};

  var active = null;

  self.Types = {
    ADD: AddType,
    REMOVE: -1,
    MOVE: 1
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
   * Saves changes
   * @return {[type]} [description]
   */
  self.save = function(stops) {

  };

  /**
   * Stop edit mode
   * @return {[type]} [description]
   */
  self.stop = function() {
    if(active && active.destroy) {
      active.destroy();
    }
  };

  return self;
})();
