/**
 * Contains helpful functions for the userinterface
 * and useful for animations.
 */

var $ = require('jquery');
var BusIcon = require('./graphic/BusIcon.js');

const BUSLINES_LEGEND = '*[data-bus-line-legend]';

class GUI {

  constructor(canvas) {
    this.canvas = canvas;
  }

  /**
   * Animates a fabricjs object from one point to another
   * returns a promise
   */
  animateCanvasObj(object, canvas, posStart, posEnd, speed) {

  }

  animateBus(pathResult) {
    return new BusIcon(pathResult, this.canvas, {});
  }

  drawLegend(lines) {

    var list = $('<ul>')
      .css({
        'list-style-type': 'none'
      });
    for(var key in lines) {
      var el = $('<li>')
        .css({
          'clear': 'both'
        })
        .appendTo(list);

      $('<div>')
        .appendTo(el)
        .css({
          float: 'left',
          height: '10px',
          width: '10px',
          'background-color': lines[key].getColor()
        });

      $('<div>')
        .text(lines[key].getId())
        .appendTo(el)
        .css({
          float: 'left'
        });
    }

    $(BUSLINES_LEGEND).html(list);

  }

}

module.exports = GUI;
