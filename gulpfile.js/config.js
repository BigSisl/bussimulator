/**
 * Contains all configurations of the gulp build, it also ports
 * package.json configuration to the gulp modules
 */

var pkg = require('../package.json').config;

module.exports = {
  dest: pkg.dest,
  src: pkg.src,
  tests: pkg.tests
};
