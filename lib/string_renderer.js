"use strict"
const elements = require("./elements");
const directions = require("./directions");

function getCharacterForDirection(dir) {
	switch(dir) {
		case directions.NORTH:
		  return "^";
		case directions.EAST:
		  return ">";
		case directions.SOUTH:
		  return "v";
		case directions.WEST:
		  return "<";
	}
}

function StringRenderer() {
}

StringRenderer.prototype.render = function(board, snake) {
	var lines = [];

	for (var y = 0; y < board.height; y++) {
		var row = [];
		for (var x = 0; x < board.width; x++) {
			var symbol;
			switch(board.getCell(x, y)) {
				case elements.WALL: 
				  symbol = "▓";
				  break;
				case elements.APPLE: 
				  symbol = "Ò";
				  break;
				case elements.BOARD: 
				  symbol = " ";
				  break;
				default:
				  symbol = "?";
			}
			row.push(symbol);
		}
		lines.push(row);
	}
	
	lines[snake.head.y][snake.head.x] = getCharacterForDirection(snake.head.direction);
	snake.path.forEach(function(pos) {
		lines[pos.y][pos.x] = getCharacterForDirection(pos.direction);
	});
	
	lines.push(["\n"]);
	lines.push(["" + JSON.stringify(snake.head)]);
	
	return lines.map(function(line) {
		return line.join("");
	}).join("\n");
};

module.exports = StringRenderer;
