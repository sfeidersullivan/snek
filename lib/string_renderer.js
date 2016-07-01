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

StringRenderer.prototype.render = function(game) {
	var board = game.board;
	var snake = game.snake;
	var score = game.score;
	
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
	
	snake.path.forEach(function(pos) {
		var char = getCharacterForDirection(pos.direction);
		lines[pos.y][pos.x] = char;
	});
	
	lines.push(["Score: ", game.score]);
	
	return lines.map(function(line) {
		return line.join("");
	}).join("\n");
};

module.exports = StringRenderer;
