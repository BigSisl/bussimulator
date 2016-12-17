/**
 * main app application as javascript
 */

var jq = require('jquery');
var bootstrap = require('./js/Bootstrap.js');

global.simulator = bootstrap;
global.simulator.start();

// TMP
simulator.Prod(true)
