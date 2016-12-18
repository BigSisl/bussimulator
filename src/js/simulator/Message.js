
var $ = require('jquery');

const LOG_ONSCREEN_ELEMENT = '*[data-package-story]';
const AUTO_HIDE_DELAY = 5000;
const FADE_OUT_TIME = 1000;

module.exports = (function() {
  var self = {};

  self.error = function(message) {
    alert(message);
    console.log(message);
  }

  self.log = function(message) {
    var el = $('<div>')
      .addClass('package-inner-story')
      .html((new Date()).toISOString().slice(11, -1)
          + ' | '
          + message.replace(/(#[a-fA-F0-9]+)/g, '<span class="package-id">$1</span>'))
      .appendTo($(LOG_ONSCREEN_ELEMENT));

    console.log(el);

    window.setTimeout(function() {
      el.fadeOut(FADE_OUT_TIME);
    }, AUTO_HIDE_DELAY);
    console.log(message);
  }

  return self;
})();
