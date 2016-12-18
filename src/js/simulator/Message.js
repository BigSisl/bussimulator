


module.exports = (function() {
  var self = {};

  self.error = function(message) {
    alert(message);
    console.log(message);
  }

  self.log = function(message) {
    console.log(message);
  }

  return self;
})();
