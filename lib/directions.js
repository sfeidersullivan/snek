"use strict";
var NORTH = "N";
var EAST = "E";
var SOUTH = "S";
var WEST = "W";

var order = [NORTH, EAST, SOUTH, WEST];

module.exports = Object.freeze({
  NORTH: NORTH,
  EAST: EAST,
  SOUTH: SOUTH,
  WEST: WEST,
  
  right: function(dir) {
    var i = order.indexOf(dir) + 1;
    return order[i === order.length ? 0 : i];
  },
  
  left: function(dir) {
    var i = order.indexOf(dir) - 1;
    return order[i < 0 ? 3 : i];
  },
  
  x: function(dir) {
    if (dir === EAST) {
      return 1;
    } else if (dir === WEST) {
      return -1;
    }
    return 0;
  },
  
  y: function(dir) {
    if (dir === SOUTH) {
      return 1;
    } else if (dir === NORTH) {
      return -1;
    }
    return 0;
  }
});
