var directions = require("./directions");
var _ = require("lodash");

function Snake(head) {
	this.path = [
		head || { x: 10, y: 10, direction: directions.SOUTH }
		];
}

Snake.prototype = {
	getHead: function() {
		return _.head(this.path);
	},

	getPath: function() {
		return _.clone(this.path);
	},

	turnLeft: function() {
		this.getHead().direction = directions.left(this.getHead().direction);
	},
	
	turnRight: function() {
		this.getHead().direction = directions.right(this.getHead().direction);
	},
	
	move: function() {
		this.path.unshift(_.clone(this.getHead()));
		this.getHead().x += directions.x(this.getHead().direction);
		this.getHead().y += directions.y(this.getHead().direction);
	},
  
  moveTail: function() {
    this.path.pop();
  },
  
  hitTail: function(otherPath) {
		var path = otherPath || this.path;
		var head = this.getHead();
    return path.some(function(pos) { 
			return pos !== head && pos.x === head.x && pos.y === head.y; 
		});
  }
};

module.exports = Snake;
