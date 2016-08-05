var elements = require("./elements");
var directions = require("./directions");
var util = require("util");

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

function colorize(text, color) {
		return util.format("{%s-fg}%s{/%s-fg}", color, text, color);
}

function StringRenderer() {
}

StringRenderer.prototype.render = function(game) {
	var board = game.board;
	
	var lines = [];

	for (var y = 0; y < board.height; y++) {
		var row = [];
		for (var x = 0; x < board.width; x++) {
			var sym;
			switch(board.getCell(x, y)) {
				case elements.WALL: 
				  sym = "▓";
				  break;
				case elements.APPLE: 
				  sym = "Ò";
				  break;
				case elements.BOARD: 
				  sym = " ";
				  break;
				default:
				  sym = "?";
			}
			row.push(sym);
		}
		lines.push(row);
	}
	
	game.players.forEach(function(player) {
		var snake = player.snake;
		snake.path.forEach(function(pos) {
			var char = getCharacterForDirection(pos.direction);
			char = colorize(char, player.color);
			lines[pos.y][pos.x] = char;
		});

		lines.push([ colorize(player.name, player.color), ": ", player.score, " ~ ", player.status]);	
	});
	
	
	return lines.map(function(line) {
		return line.join("");
	}).join("\n");
};

module.exports = StringRenderer;
