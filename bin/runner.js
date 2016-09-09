#!/usr/bin/env node
'use strict';

var program = require('commander');
var blessed = require('blessed');
var path = require('path');
var Ticker = require('../lib/ticker.js');
var App = require('../lib/app.js');
var fs = require("fs");

program._name = 'snek';
program.usage('[options] <player1> <player2>')
	.option('--speed <speed>', 
		'specify the speed in milliseconds for each tick')
	.option('-p, --pause', 
		'whether or not to automatically start the ticker')
	.option('--map <map>',
		'which map to load')
	.parse(process.argv);
	
var config = {
	speed: program.speed || 100,
	map: program.map || "maps/default.json"
};

config.map = JSON.parse(fs.readFileSync(config.map, { encoding: 'utf-8' }));

var screen = blessed.screen({
	debug: true
});

function keyboardController() {
	var controller = {
		nextMove: "",
		getNextMove: function() {
			var move = this.nextMove;
			this.nextMove = "";
			return move;
		}
	};

	screen.key(['a'], function(ch, key) {
	    controller.nextMove = "left";
	});

	screen.key(['s'], function(ch, key) {
		controller.nextMove = "right";
	});

	return controller;
}

var controller1;
var controller2;

if (program.args[0] === "k" || !program.args[0]) {
	controller1 = keyboardController();
	controller1.name = "Player 1";
} else {
	controller1 = require(path.resolve(process.cwd(), program.args[0]));
}	

if (program.args[1] === "k") {
	controller2 = keyboardController();
	controller2.name = "Player 2";
} else if (program.args[1]) {
	controller2 = require(path.resolve(process.cwd(), program.args[1]));
}	
	
var app = new App(config, controller1, controller2);

// Create ui components
var box = blessed.box({
	top: 2,
  left: 2,
  width: config.map.width,
  height: config.map.height + 2,
  content: app.renderBoard(),
  tags: true,
  style: {
    fg: config.fg,
    bg: config.bg
  }
});
screen.append(box);

// finished creating ui components

function onTick() {
	app.tick();
	box.setContent(app.renderBoard());
	screen.render();
}

var ticker = new Ticker(config.speed, onTick);
if (!program.pause) {
	ticker.start();
}

screen.key(['space'], function(ch, key) {
	if (!ticker.running) {
		onTick();
	}
});

screen.key(['p'], function(ch, key) {
	ticker.toggle();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();


console.log = function() {
	screen.debug.apply(screen, arguments);
};
