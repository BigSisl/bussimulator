/**
 * will start a test server / files can be profideed by any kind of system.
 * just needs location:
 * - components_templates/ -> html sources
 * - components_scripts/ -> js sources
 * - pages/ -> json source
 * - user_config/
 */
var config = require('./package.json');
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/dest')).listen(8000, function(){
  console.log('Server running on 8000...');
});
