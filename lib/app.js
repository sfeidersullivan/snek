var Board = require('./board');
var Game = require('./game');
var StringRenderer = require('./string_renderer');

function App(config, controller) {
	var board = new Board(config.width, config.height);
	this.game = new Game(board, controller);

	config.liveCells.forEach(function(liveCell) {
		board.setCell(liveCell[0], liveCell[1], true);
	});

	this.renderer = new StringRenderer();
}

App.prototype.renderBoard = function() {
	return this.renderer.render(this.game);
};

App.prototype.tick = function() {
	this.game.tick();
};

module.exports = App;
