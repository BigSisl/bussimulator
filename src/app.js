/**
 * main app application as javascript
 */

var jq = require('jquery');
var bootstrap = require('./js/Bootstrap.js');

global.simulator = bootstrap;

global.simulator.load('./json/demo/', function() {
  global.simulator.start();
  simulator.Prod(true);
});
