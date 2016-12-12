/**
 * Save module
 * Saves the information to the local storage, or loads from the local storage
 * or server
 */

var jq = require('jquery');

module.exports = (function() {
  var self = {};

  // localStorage
  function set(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  // localStorage
  function get(key) {
    return jq.parseJSON(localStorage.getItem(key));
  }

  /**
   * Saving all changes
   * @return {[type]} [description]
   */
  self.set = function(key, obj) {
    set(key, typeof obj !== 'string' ? JSON.stringify(obj) : obj);
  }

  self.get = function(key) {
    return jq.parseJSON(get(key));
  }

  return self;
})();
