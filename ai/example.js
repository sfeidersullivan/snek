var _ = require("lodash");
var elements = require("../lib/elements");
var directions = require("../lib/directions");

// Give your bot a name!
module.exports.name = "Naïve Norman";

module.exports.getNextMove = function(game, player, opponent) { 
  /***************************
   * BEGIN EXAMPLE ALGORITHM *
   ***************************/
  var apple = game.board.apple;
  var head = player.snake.getHead();

  var decision;
  switch (head.direction) {
    case directions.NORTH:
      if (apple.x > head.x) decision = "right";
      else if (apple.x < head.x) decision = "left"; 
      break;
    case directions.SOUTH:
      if (apple.x < head.x) decision = "right";
      else if (apple.x > head.x) decision = "left"; 
      break;
    case directions.EAST:
      if (apple.y > head.y) decision = "right"; 
      else if (apple.y < head.y) decision = "left";
      break;
    case directions.WEST:
      if (apple.y < head.y) decision = "right"; 
      else if (apple.y > head.y) decision = "left"; 
      break;
  }
  
  if (decision) {
    console.log("My decision is: %s", decision);    
  }

  return decision;
  /***************************
   * END EXAMPLE ALGORITHM *
   ***************************/
};
