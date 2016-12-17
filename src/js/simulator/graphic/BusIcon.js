/**
 * This class is only used to animate the packe on the busline
 * @type {[type]}
 */
var $ = require('jquery');
var fabric = require('fabric-browserify').fabric;

var BusIcon = function(linePath, canvas, config) {
  /**
   * Prepare default configurations / values
   * @type {[type]}
   */
  config = $.extend({
    /**
     * Bus num pixel in one s
     * @type {Number}
     */
    busspeed: 20,

    /**
     * ms needed to change packe from one line to the other
     * @type {Number}
     */
    swapspeed: 5,

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

    // generate animation queue
    $.each(linePath, function(i, path) {
      var last = i > 0 ? linePath[i - 1] : null;

      if(last) {
        if(last.stop.getId() === path.stop.getId()) {
          console.log('same Stop -> Line Swap', last.line.getId(), path.line.getId());
        } else {
          animationQueue.push(waitFunction(1000));
          animationQueue.push(animateFunction(
            last.stop.getPos(),
            path.stop.getPos(),
            config.busspeed
          ));
        }
      }

    });

    animationQueue.push(disapearAnimation(1000));

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
    return function(deltaTime) {
      console.log('deltaTime', deltaTime, posStart, posEnd, speed);

      canvasObjects.set({
        top: (posEnd.y ? posEnd.y : posEnd.top),
        left: (posEnd.x ? posEnd.x : posEnd.left)
      });

      console.log(canvasObjects.getLeft(), canvasObjects.getTop());

      canvas.remove(canvasObjects);
      canvas.add(canvasObjects);

      return true;
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
