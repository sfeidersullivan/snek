var _ = require("lodash");

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

function getMove(game, player) {
	var controller = player.controller;

	if (player.status != "ok") {
		return;
	}

	if (controller) {
		try {
		    return controller.getNextMove(game, player);
		} catch (e) {
			player.status = "error";
			return;
		}
	}
}

function tickPlayer(game, player, nextMove) {
	var snake = player.snake;

	if (player.status != "ok") {
		return player.status;
	}

	if (nextMove === "left") {
		snake.turnLeft();
	} else if (nextMove === "right") {
		snake.turnRight();
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
		players.forEach(function (playerB) {
			if (playerA !== playerB && playerA.snake.hitTail(playerB.snake.getPath())) {
				playerA.status = "hit opponent";
			}
		});
	});
}

Game.prototype.tick = function () {
	var players = _.shuffle(this.players); // Shuffle for fairness
	var moves = players.map(getMove.bind(null, this)); 

	players.forEach(function(player, i) {
		tickPlayer(this, player, moves[i]);
	}, this);

	resolveCollisions(players);

	return this.players.map(function(player) { return player.status; });
};

module.exports = Game;
