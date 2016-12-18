/**
 * Contains helpful functions for the userinterface
 * and useful for animations.
 */

var $ = require('jquery');
var BusIcon = require('./graphic/BusIcon.js');
var fabric = require("fabric-browserify").fabric;

const BUSLINES_LEGEND = '*[data-bus-line-legend]';
const CANVAS_ELEMENT = '#canvas-simulator';

const MAPS = {
  'zuerich': {
    'name': 'zuerich',
    'img': './data/maps/zuerich_map.png',
    'size': {
      'height': 1015,
      'width': 1920
    },
    'url': './json/zuerich/'
  },
  'demo': {
    'name': 'demo',
    'img': '',
    'size': {
      'height': 800,
      'width': 1000
    },
    'url': './json/demo/'
  }
}

class GUI {

  constructor(map) {
    this.map = MAPS[map];
    $(CANVAS_ELEMENT)
      .attr('height', this.map.size.height)
      .attr('width', this.map.size.width);
    this.canvas = new fabric.Canvas('canvas-simulator');
    this.canvas.setBackgroundImage(this.map.img, this.canvas.renderAll.bind(this.canvas), {
      // Needed to position backgroundImage at 0/0
      originX: 'left',
      originY: 'top'
    });
  }

  /**
   * Animates a fabricjs object from one point to another
   * returns a promise
   */
  animateCanvasObj(object, canvas, posStart, posEnd, speed) {

  }

  getCanvas() {
    return this.canvas;
  }

  animateBus(pathResult) {
    return new BusIcon(pathResult, this.canvas, {});
  }

  getActiveMap() {
    return this.map;
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
