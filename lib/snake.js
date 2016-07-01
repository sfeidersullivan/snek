var directions = require("./directions");
var _ = require("lodash");

function Snake(head) {
	this.path = [{ x: 10, y: 10, direction: directions.SOUTH }];
}

Snake.prototype = {
	getHead: function() {
		return _.head(this.path);
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
  
  eat: function(apple) {
    if (!apple) {
      this.path.pop();
    }
  },
  
  hitTail: function() {
    return false;
    // return this.path.some(function(pos) { return pos.x === head.x && pos.y === head.y });
  }
};

module.exports = Snake;
