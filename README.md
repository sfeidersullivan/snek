snek: a technical challenge
===========================

Forked from coalman/blessed-life

Getting Started
---------------

### Installation

Clone this repo to a nice spot on your computer. Open a terminal emulator and `cd` to the directory.

If you're on Windows, cmd.exe, PowerShell, and git bash all work fine.
On Mac OSX, Terminal.app will do.

Make sure you have [node.js][nodejs] properly installed. Then use `npm` to install your dependencies:

    $ npm install

### Running

You can start the program by opening a terminal and entering:

    $ node bin/runner

There are many command line switches that can be used (use `-h` or `--help` for more information). 

### Challenge

The technical challenge is to make a bot that plays the game of snek. The bot will have information about the whole game board. There are only two moves that can be made: turn left and turn right. The snek will continue moving in a straight line if no move is made.

# Rules

Your bot may use any information provided to it about the game board. It may not:
* Modify any game state.
* Pause the game.
* Attempt to subvert or sabotage the normal flow of the game.

 
