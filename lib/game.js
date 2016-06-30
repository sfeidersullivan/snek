'use strict';

var Board = require("./board");
var Snake = require("./snake");
var elements = require("./elements");

function Game(board, controller) {
	this.board = board;
	this.controller = controller;
	this.snake = new Snake();
	this.score = 0;
};

Game.prototype.tick = function() {
	var snake = this.snake;
	var board = this.board;
	var controller = this.controller;
	
	if (controller) {
		var nextMove = controller.getNextMove();
		if (nextMove === "left") {
			snake.turnLeft();
		} else if (nextMove === "right") {
			snake.turnRight();
		}
	}
	
	snake.move();
	var el = board.getCell(snake.head.x, snake.head.y);
	if (el === elements.APPLE) {
		snake.eat(true);
		board.makeApple();
	  this.score++;
	} else if (el === elements.WALL) {
		throw new Error("Hit wall");
	} else if (snake.hitTail()) {
		throw new Error("Hit tail");
	} else {
		snake.eat(false);
	}
	
};

module.exports = Game;
