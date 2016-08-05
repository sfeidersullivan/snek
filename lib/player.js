var Snake = require("./snake");

var Player = function(controller, head, color) {
    this.name = controller.name || "Player";
    this.snake = new Snake(head);
    this.controller = controller;
	this.score = 0;
	this.status = "ok";
    this.color = color || "green";
};

module.exports = Player;