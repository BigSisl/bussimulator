/**
 * Contains helpful functions for the userinterface
 * and useful for animations.
 */

var $ = require('jquery');

const BUSLINES_LEGEND = '*[data-bus-line-legend]';

class GUI {

  constructor(canvas) {

  }

  /**
   * Animates a fabricjs object from one point to another
   * returns a promise
   */
  animateCanvasObj(object, canvas, posStart, posEnd, speed) {

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
