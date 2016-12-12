// @flow
/**
 * Contains the different Stops
 */

var jq = require('jquery');
var fabric = require("fabric-browserify").fabric;

module.exports = function(stop) {
 var self = {};

 /**
  * Dataobject of the stop, containg all informations
  * @type {[type]}
  */
 var Stop = jq.extend({
   /**
    * Name to display of the stop
    * @type {String}
    */
   name: '',

   /**
    * Extra information of the stop
    * @type {String}
    */
   description: '',

   /**
    * If it is a hub
    * @type {Boolean}
    */
   hub: false,

   /**
    * Information of the lines, which this stop is part of
    * @type {Array}
    */
   lines: [],

   /**
    * Position in grid
    * @type {Object}
    */
   pos: {
     top: 0,
     left: 0
   }
 }, stop);

 /**
  * Fabric circle / GUI representation
  * @type {fabric}
  */
 var Circle = null;

 /**
  * Encapsulated function to prepare eventhandling of the circle
  */
  (function() {
    Circle = new fabric.Circle({
      radius: 20, left: Stop.pos.left, top: Stop.pos.top, fill: '#aac',
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });
  })();

  self.getCircle = function() {
    return Circle;
  };

 /**
  * click handler for the
  * @return {[type]} [description]
  */
 function onClick() {
   console.log('stop clicked');
 }

 /**
  * Returns main data object as json
  */
 self.getJSON = function() {
   return JSON.stringify(Stop);
 }

 /**
  *
  * @return {Boolean} If it supports a hub / drones
  */
 self.isHub = function() {
   return hub;
 }

 /**
  * Drawes / redraws the stop on the map
  * TMP: later move to other class for drawing -> seperate GUI and Logic
  * This is a logic class
  * @param canvas Needs fabricjs object for drawing
  * @return {[type]} [description]
  */
 self.draw = function(canvas) {
   canvas.add(Circle);
 }

 self.remove = function(canvas) {
   canvas.remove(Circle);
 }

 /**
  * React on button click
  */
 self.click = function() {
   console.log('stop clicked');
 }

 return self;
}
