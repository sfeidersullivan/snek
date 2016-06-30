var directions = require("./directions");
var _ = require("lodash");

function Snake(head) {
	this.head = head || { x: 10, y: 10, direction: directions.SOUTH };
	this.path = [];
}

Snake.prototype = {
	turnLeft: function() {
		this.head.direction = directions.left(this.head.direction);
	},
	
	turnRight: function() {
		this.head.direction = directions.right(this.head.direction);
	},
	
	move: function() {
		this.path.push(_.clone(this.head))
		this.head.x += directions.x(this.head.direction);
		this.head.y += directions.y(this.head.direction);
	},
  
  eat: function(apple) {
    if (!apple) {
      this.path.shift();
    }
  },
  
  hitTail: function() {
    var head = this.head;
    return false;
    // return this.path.some(function(pos) { return pos.x === head.x && pos.y === head.y });
  }
};

module.exports = Snake;
