'use strict';

var Board = require("./board");
var Snake = require("./snake");
var elements = require("./elements");

function Game(board, controller) {
	this.board = board;
	this.controller = controller;
	this.snake = new Snake();
	this.score = 0;
	this.status = "ok";
}

Game.prototype.tick = function() {
	var snake = this.snake;
	var board = this.board;
	var controller = this.controller;
	
	if (this.status != "ok") {
		return this.status;
	}
	
	if (controller) {
		var nextMove = controller.getNextMove();
		if (nextMove === "left") {
			snake.turnLeft();
		} else if (nextMove === "right") {
			snake.turnRight();
		}
	}
	
	snake.move();
	var el = board.getCell(snake.getHead().x, snake.getHead().y);
	if (el === elements.APPLE) {
		snake.eat(true);
		board.makeApple();
	  this.score++;
	} else if (el === elements.WALL) {
		this.status = "hit wall";
	} else if (snake.hitTail()) {
		this.status = "hit tail";
	} else {
		snake.eat(false);
	}	
	
	return this.status;
};

module.exports = Game;
