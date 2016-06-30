#!/usr/bin/env node
'use strict';

var program = require('commander');
var blessed = require('blessed');
var fs = require('fs');
var path = require('path');
var Ticker = require('../lib/ticker.js');
var App = require('../lib/app.js');

program._name = 'blessed-life';
program.usage('[options] <config>')
	.option('--width <width>', 
		'specify the width of the grid', parseInt)
	.option('--height <height>', 
		'specify the height of the grid', parseInt)
	.option('--livecell <ch>', 
		'specify the char to use for live cells')
	.option('--deadcell <ch>', 
		'specify the char to use for dead cells')
	.option('--fg <color>', 
		'specify the foreground color of the simulation.')
	.option('--bg <color>', 
		'specify the background color of the simulation.')
	.option('--speed <speed>', 
		'specify the speed in milliseconds for each tick')
	.option('-a, --autostart', 
		'whether or not to automatically start the simulation')
	.parse(process.argv);
var configFile = {};
if (program.args.length > 0) {
	var configPath = path.resolve(program.args[0]);
	var json = fs.readFileSync(configPath, { encoding: 'utf-8' });
	configFile = JSON.parse(json);
}
var config = {
	width: (!isNaN(program.width) ? program.width : configFile.width || 0),
	height: (!isNaN(program.height) ? program.height : configFile.height || 0),
	liveCell: program.livecell || configFile.livecell || '█',
	deadCell: program.deadcell || configFile.deadcell || ' ',
	speed: program.speed || configFile.speed || 250,
	fg: program.fg || configFile.fg || 'white',
	bg: program.bg || configFile.bg || 'black',
	liveCells: configFile.liveCells || []
};

var screen = blessed.screen();

config.width = 50;
config.height = 25;

var controller = {
	nextMove: "",
	
	getNextMove: function() {
		var move = this.nextMove;
		this.nextMove = "";
		return move;
	}
};

var app = new App(config, controller);

// Create ui components
var box = blessed.box({
  top: 3,
  left: 3,
  width: '100%',
  height: '100%',
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
if (program.autostart) {
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

screen.key(['a'], function(ch, key) {
	controller.nextMove = "left";
});

screen.key(['s'], function(ch, key) {
	controller.nextMove = "right";
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
