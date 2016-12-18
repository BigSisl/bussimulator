/**
 * This class is only used to animate the packe on the busline
 * @type {[type]}
 */
var $ = require('jquery');
var fabric = require('fabric-browserify').fabric;
var StopClass = require('../Stops.js');

/**
 * Package event list
 */
const PACKAGE_STARTED           = global.PACKAGE_STARTED          = 0;
const PACKAGE_CHANGEING_LINE    = global.PACKAGE_CHANGEING_LINE   = 1;
const PACKAGE_PASSINGSTOP       = global.PACKAGE_PASSINGSTOP      = 2;
const PACKAGE_REACHED_ENDSTOP   = global.PACKAGE_REACHED_ENDSTOP  = 3;

const PACKAGE_WAITING_FOR_BUS   = global.PACKAGE_WAITING_FOR_BUS  = 20;
const PACKAGE_GOT_ON_BUS        = global.PACKAGE_GOT_ON_BUS       = 10;
const PACKAGE_WAITING_FOR_DRONE = global.PACKAGE_WAITING_FOR_DRONE= 21;
const PACKAGE_GOT_ON_DRONE      = global.PACKAGE_GOT_ON_DRONE     = 11;

var BusIcon = function(linePath, canvas, config) {
  /**
   * Prepare default configurations / values
   * @type {[type]}
   */
  config = $.extend({
    /**
     * Bus num pixel in one ms
     * @type {Number}
     */
    busspeed: 0.2,

    /**
     * ms needed to change packe from one line to the other
     * @type {Number}
     */
    swapspeed: 500,

    dronewaiting: 1000
  }, config);

  var self = {};

  var done = false;

  var dfd = $.Deferred();

  var canvasObjects = [],
    currentPos = 0;

  var startTime,
    prevTime,
    funcStartTime;

  var animationQueue;

  var target = null;

  function constructor() {
    // start animation loop
    fabric.loadSVGFromURL('./data/PackageBoxIcon.svg', loadedSvg);
  }

  function loadedSvg(objects, options) {
    canvasObjects = fabric.util.groupSVGElements(objects, options);

    canvasObjects.set({
      left: linePath[0].stop.getPos().left,
      top: linePath[0].stop.getPos().top,
      scaleX: 0.4,
      scaleY: 0.4
    });

    canvas.add(canvasObjects);

    animationQueue = [];

    var droneEnd = linePath.pop();
    target = droneEnd.target;

    animationQueue.push(eventCallback(PACKAGE_STARTED));
    // generate animation queue
    $.each(linePath, function(i, path) {
      var last = i > 0 ? linePath[i - 1] : null;

      if(last) {
        if(last.stop.getId() === path.stop.getId()) {
          animationQueue.push(eventCallback(PACKAGE_CHANGEING_LINE, [last.line, path.line]));
          animationQueue.push(eventCallback(PACKAGE_WAITING_FOR_BUS, [path.line]));
          animationQueue.push(waitFunction(config.swapspeed));
          animationQueue.push(eventCallback(PACKAGE_GOT_ON_BUS, [path.line]));
        } else {
        animationQueue.push(eventCallback(PACKAGE_PASSINGSTOP, [path.stop]));
          animationQueue.push(animateFunction(
            last.stop.getPos(),
            path.stop.getPos(),
            config.busspeed
          ));
        }
      }

    });

    // at the end remove target
    if(droneEnd.target) {
      // change to bus
      animationQueue.push(eventCallback(PACKAGE_WAITING_FOR_DRONE));
      animationQueue.push(waitFunction(1000));
      animationQueue.push(eventCallback(PACKAGE_GOT_ON_DRONE));
      animationQueue.push(animateFunction(
        linePath[linePath.length - 1].stop.getPos(),
        {
          left: droneEnd.target.getPos().left - StopClass.getRadius(),
          top: droneEnd.target.getPos().top - StopClass.getRadius()
        },
        config.busspeed
      ));
      animationQueue.push(eventCallback(PACKAGE_REACHED_ENDSTOP));

      animationQueue.push(disapearAnimation(config.dronewaiting));

      animationQueue.push(RemoveTargetAnimation(
        droneEnd.target
      ));
    }

    startTime = prevTime = funcStartTime = Date.now();
    animationFunction = null;
    done = true;
    runAnimationQueue();
  }

  var cancelRequestAnimFrame = (function(){
  	return 	window.cancelAnimationFrame ||
  			window.webkitCancelRequestAnimationFrame ||
  			window.mozCancelRequestAnimationFrame ||
  			window.oCancelRequestAnimationFrame ||
  			window.msCancelRequestAnimationFrame ||
  			clearTimeout
  })();

  var animationFunction = null;

  function eventCallback(event, args) {
    return function() {
      if(target) {
        target.on(event, args);
      }
      return true;
    }
  }

  function createCallback(cb) {
    return function() {
      cb();
      return true;
    }
  }

  function RemoveTargetAnimation(target) {
    return function() {
      console.log('remove target');
      target.remove(canvas);
      return true;
    }
  }

  function runAnimationQueue() {
  	request = fabric.util.requestAnimFrame(runAnimationQueue);

    // update animation timers
    prevTime = startTime;
    startTime = Date.now();

    if(!done && animationFunction) {
      done = animationFunction(startTime - prevTime, startTime - funcStartTime);
    } else if(animationQueue.length > 0) {
      animationFunction = animationQueue.shift();
      done = false;
      funcStartTime = startTime;
    }

  	if(done && animationQueue.length <= 0) {
      cancelRequestAnimFrame(request);
  	}

    // render last
    canvas.renderAll();
  }

  function disapearAnimation(speed) {
    return function(deltaTime, totalTime) {
      if(totalTime > speed) {
        canvas.remove(canvasObjects);
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * includes wait function, returns true when wait is done
   * @return {[type]} [description]
   */
  function waitFunction(wait) {
    var started = null;
    return function(deltaTime, funcStart) {
      return funcStart >= wait;
    }
  }

  /**
   * Return true when animation complete
   * @param  {[type]} posStart  [description]
   * @param  {[type]} posEnd    [description]
   * @param  {[type]} deltaTime [description]
   * @param  {[type]} speed     pixel per ms
   * @return {[type]}           [description]
   */
  function animateFunction(posStart, posEnd, speed) {

    posEnd.y = (posEnd.y ? posEnd.y : posEnd.top);
    posEnd.x = (posEnd.x ? posEnd.x : posEnd.left);

    posStart.y = (posStart.y ? posStart.y : posStart.top);
    posStart.x = (posStart.x ? posStart.x : posStart.left);

    var length = Math.sqrt(
      Math.pow(Math.abs(posEnd.x - posStart.x), 2) +
      Math.pow(Math.abs(posEnd.y - posStart.y), 2)
    );

    var speed = speed

    return function(deltaTime, totalTime) {
      var pos = totalTime * speed;

      var y = pos * (posEnd.y - posStart.y) / length,
          x = pos * (posEnd.x - posStart.x) / length;

      canvasObjects.set({
        top: pos >= length ? posEnd.y : posStart.y + y, // (posEnd.y ? posEnd.y : posEnd.top),
        left: pos >= length ? posEnd.x : posStart.x + x // (posEnd.x ? posEnd.x : posEnd.left)
      });

      canvas.remove(canvasObjects);
      canvas.add(canvasObjects);

      return pos >= length;
    }
  }

  function getPathLength() {

  }

  /**
   * Returns the current Position
   * @return {[type]} [description]
   */
  function getCurrentPos() {

  }

  /**
   * Stops the animation
   * @return {[type]} [description]
   */
  self.stop = function() {
    done = true;
  }

  self.getDeferred = function() {
    return dfd.promise();
  }

  constructor();
  return self;
};

module.exports = BusIcon;
