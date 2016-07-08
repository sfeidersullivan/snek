'use strict';

var elements = require("./elements");
var _ = require("lodash");

function create2dArray(width, height) {
	var rows = new Array(width || 0);

	for (var x = 0; x < width || 0; x++) {
		rows[x] = new Array(height || 0);
		if (x === 0 || x === width - 1) {
			rows[x].fill(elements.WALL);
		} else {
			rows[x].fill(elements.BOARD);
			rows[x][0] = elements.WALL;
			rows[x][height - 1] = elements.WALL;
		}
	}

	return rows;
}

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.cells = create2dArray(width, height);
	this.makeApple();
}

Board.prototype.getCell = function(x, y) {
	return this.cells[x][y];
};

Board.prototype.setCell = function(x, y, value) {
	this.cells[x][y] = value;
};

Board.prototype.isInBounds = function(x, y) {
	return (0 <= x && x < this.width) &&
		(0 <= y && y < this.height);
};

Board.prototype.makeApple = function(snake) {
	var emptyCell = this.findEmptyCell(snake);
	if (!emptyCell) {
		return false;
	}
	
	// Place apple
	this.setCell(emptyCell.x, emptyCell.y, elements.APPLE);
	
	// Clean up last apple
	if (this.apple) {
		this.setCell(this.apple.x, this.apple.y, elements.BOARD);
	}
	
	this.apple = emptyCell;
	return true;
};

Board.prototype.findEmptyCell = function(snake) {	
	function match(pos) {
		return pos.x == x && pos.y == y;
	}
	
	for (var i = 0; i < 10000; i++) {
		var x = _.random(0, this.width - 1);
		var y = _.random(0, this.height - 1);
		
		if (this.getCell(x, y) === elements.BOARD) {
			if (snake && snake.path.some(match)) {
				continue;
			}
			return { x: x, y: y };
		}		
	}
};

module.exports = Board;
