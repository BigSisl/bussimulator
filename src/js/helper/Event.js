/**
 * Simple event helper library, for removing events cleanly again
 * @param {[type]} canvas [description]
 */
var fabric = require('fabric-browserify').fabric;
var jq = require('jquery');

module.exports = function(canvas) {
  var self = {};

  self.add = function(event, callback) {
    // add temporary value, to be sure that it can be removed
    callback.tmp = true;

    canvas.on(event, callback);
  };

  /**
   * Removes all events added
   * @return {[type]} [description]
   */
  self.removeAll = function() {
    for (var event in canvas.__eventListeners) {
      canvas.__eventListeners[event] = jq.grep(canvas.__eventListeners[event], function(el) {
        return !el.tmp;
      });
    }
  };

  return self;
}
