/**
 * Simulates the way from stop one to stop two
 * Simply enter those two stops.
 * It uses the A* algorythm
 */

/**
 * TODO:
 * Using astar.js
 * simulate the graph and nodes -> test
 */
var astar = require('./Astar.js').astar;
var Graph = require('./Astar.js').Graph;
var StopClass = require('./Stops.js');
var $ = require('jquery');

class CustomGraph {

  constructor(stops) {
    var self = this;
    self.nodes = [];

    // FIX: Slow way to create the graph, but works
    $.each(stops, function(i, stop) {
      // create a stop for each line
      var linestops = [];

      var allLines = stop.getLines();
      for(var i = 0; i < allLines.length; i++) {
        var line = allLines[i];
        var linestop = new CustomNode(stop, line);

        // add itselfs and to the other as neighbors, when on same stop
        for (var i = 0; i < linestops.length; i++) {
          self.addEachOtherAsNeighbor(linestops[i], linestop);
        }

        // find neighboring stops, which are connected on same line
        var error = true;
        var stops = linestop.line.getStops();
        $.each(stops, function(i, constop) {
          if(constop === stop) {
            if(i - 1 >= 0) {
              var foundNode = self.findNodeByStopAndLine(stops[i - 1], line);
              if(foundNode) {
                self.addEachOtherAsNeighbor(
                  foundNode, linestop
                );
              }
            }

            if(i + 1 < stops.length) {
              var foundNode = self.findNodeByStopAndLine(stops[i + 1], line);
              if(foundNode) {
                self.addEachOtherAsNeighbor(
                  foundNode, linestop
                );
              }
            }

            error = false;
          }
        });
        // since stop needs to be found on line call out the error
        if(error) {
          console.error(stop);
          throw new Exeption('Could not find the stop');
        }

        linestops.push(linestop);
      };

      self.nodes = self.nodes.concat(linestops);
    });

    self.dirtyNodes = [];

    for (var i = 0; i < self.nodes.length; i++) {
      astar.cleanNode(self.nodes[i]);
    }
  }

  /**
   * Sets a hub, by looking for the node, where the stop === hub
   * hub is nothing more then the stop
   * and then create a new node, which will connect with the other nodes on that
   * stop
   */
  setHub(hub) {
    var self = this;
    var node = new CustomNode(hub, null);
    $.each(self.findNodesByStop(hub), function(i, neighbor) {
       self.addEachOtherAsNeighbor(
          node, neighbor
       );
    });
    self.nodes.push(node);
    astar.cleanNode(node);

    return node;
  }

  setTarget(target) {
    var self = this;
    var node = new CustomNode(target.stop, null);
    node.target = target;
    $.each(self.findNodesByStop(target.stop), function(i, neighbor) {
       self.addEachOtherAsNeighbor(
          node, neighbor
       );
    });
    self.nodes.push(node);
    astar.cleanNode(node);

    return node;
  }

  /**
   * Creates target node, a custom node, which is connected a given stop
   * but on a different position, to simulate the actual target
   */
  searchByTarget(target, hub) {
    var result = astar.search(this, this.setHub(hub), this.setTarget(target));

    return $.map(result, function(r) {
      return {
        line: r.line,
        stop: r.stop,
        target: r.target
      };
    });
  }

  search(start, end) {
    var result = astar.search(this, this.findNodesByStop(start)[0], this.findNodesByStop(end)[0]);

    return $.map(result, function(r) {
      return {
        line: r.line,
        stop: r.stop
      };
    });
  }

  addEachOtherAsNeighbor(node1, node2) {
    node1.addNeighbor(node2);
    node2.addNeighbor(node1);
  }

  findNodesByStop(stop) {
    var self = this;
    var found = [];
    for (var i = 0; i < self.nodes.length; i++) {
      if(self.nodes[i].stop.getId() === stop.getId()) {
        found.push(self.nodes[i]);
      }
    }
    return found;
  }

  findNodeByStopAndLine(stop, line) {
    var self = this;
    var found = null;
    for (var i = 0; i < self.nodes.length; i++) {
      if(self.nodes[i].stop.getId() === stop.getId() &&
        self.nodes[i].line.getId() === line.getId()) {
        found = self.nodes[i];
      }
    }
    return found;
  }

  /**
   * Make node dirty
   */
   cleanDirty() {
     for (var i = 0; i < this.dirtyNodes.length; i++) {
       astar.cleanNode(this.dirtyNodes[i]);
     }
     this.dirtyNodes = [];
   };

   markDirty(node) {
     this.dirtyNodes.push(node);
   };

  /**
   * Returns the neighbouring nodes
   */
  neighbors(node) {
    return node.getNeighbors();
  }
}

class CustomNode {

  constructor(stop, line) {
    this.closed = false;
    this.visited = false;
    this.stop = stop;
    this.line = line;
    this.x = stop.getCircle().left;
    this.y = stop.getCircle().top;

    this.neighbors = [];

    this.weight = 1;
  }

  addNeighbor(node) {
    this.neighbors.push(node);
  }

  getNeighbors() {
    return this.neighbors;
  }

  getStop() {
    return stop;
  }

  isWall() {
    return false;
  }

  getCost(fromNeighbor) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  };

}

module.exports = function(stops, lines) {
  var self = {};

  (function() {

  });

  /**
   * Lines can only be swaped, when they are defined
   * as contributers
   */

  self.getPath = function(start, end) {
    var customGraph = new CustomGraph(stops);

    return customGraph.search(start, end);
  };

  self.getPathByTarget = function(target) {
    var customGraph = new CustomGraph(stops);

    // customGraph define hub

    return customGraph.searchByTarget(target, StopClass.getHub(stops));
  };

  return self;
};
