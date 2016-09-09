var Board = require('./board');
var Game = require('./game');
var StringRenderer = require('./string_renderer');

function App(config, controller1, controller2) {
	var board = new Board(config.map.width, config.map.height, config.map.walls);

	this.game = new Game(board, controller1, controller2);		

	this.renderer = new StringRenderer();
}

App.prototype.renderBoard = function() {
	return this.renderer.render(this.game);
};

App.prototype.tick = function() {
	var result = this.game.tick();
};

module.exports = App;
