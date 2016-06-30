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

// TODO: add some error checking.

Board.prototype.getCell = function(x, y) {
	return this.cells[x][y];
};
Board.prototype.setCell = function(x, y, value) {
	this.cells[x][y] = value;
};
Board.prototype.toggleCell = function(x, y) {
	this.cells[x][y] = !this.isAlive(x, y);
};
Board.prototype.isInBounds = function(x, y) {
	return (0 <= x && x < this.width) &&
		(0 <= y && y < this.height);
};
Board.prototype.isAlive = function(x, y) {
	return this.getCell(x, y) === true;
};
Board.prototype.isDead = function(x, y) {
	return this.getCell(x, y) !== true;
};
Board.prototype.getLiveNeighbors = function(x, y) {
	var count = (this.isAlive(x, y) ? -1 : 0);
	for (var yD = 0; yD < 3; yD++) {
		for (var xD = 0; xD < 3; xD++) {
			if (this.isInBounds(x + xD - 1, y + yD - 1) && 
				this.isAlive(x + xD - 1, y + yD - 1)) {
				count++;
			}
		}
	}
	return count;
};

Board.prototype.makeApple = function() {
	var x = _.random(0, this.width);
	var y = _.random(0, this.height);
	this.setCell(
		x, 
		y,
		elements.APPLE
	);
};

module.exports = Board;
