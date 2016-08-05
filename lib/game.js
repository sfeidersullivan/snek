var Player = require("./player");
var elements = require("./elements");
var directions = require("./directions");

function Game(board, controller1, controller2) {
	this.board = board;
	this.players = [
		new Player(controller1,
			{ x: 10, y: 5, direction: directions.SOUTH },
			"green"
		)];
	if (controller2) {
		this.players.push(new Player(
			controller2, 
			{ x: 40, y: 20, direction: directions.NORTH },
			"yellow"));
	}
}

function tickPlayer(game, player) {
	var snake = player.snake;
	var controller = player.controller;

	if (player.status != "ok") {
		return player.status;
	}

	if (controller) {
		var nextMove = controller.getNextMove(game, player);
		if (nextMove === "left") {
			snake.turnLeft();
		} else if (nextMove === "right") {
			snake.turnRight();
		}
	}

	snake.move();

	var el = game.board.getCell(snake.getHead().x, snake.getHead().y);
	if (el === elements.APPLE) {
		game.board.makeApple();
		player.score++;
	} else if (el === elements.WALL) {
		player.status = "hit wall";
	} else if (snake.hitTail()) {
		player.status = "hit tail";
	} else {
		snake.moveTail();
	}
}

function resolveCollisions(players) {
	players.forEach(function (playerA) {
		console.log(playerA);
		players.forEach(function (playerB) {
			if (playerA !== playerB && playerA.snake.hitTail(playerB.snake.getPath())) {
				playerA.status = "hit opponent";
			}
		});
	});
}

Game.prototype.tick = function () {
	this.players.forEach(tickPlayer.bind(null, this));
	resolveCollisions(this.players);

	return this.status;
};

module.exports = Game;
