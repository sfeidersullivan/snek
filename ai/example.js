var _ = require("lodash");
var elements = require("../lib/elements");
var directions = require("../lib/directions");

module.exports.getNextMove = function(game, player) {
  // PUT YOUR ALGORITHM HERE
  
  /***************************
   * BEGIN EXAMPLE ALGORITHM *
   ***************************/
  var apple = game.board.apple;
  var head = player.snake.getHead();
  
  switch (head.direction) {
    case directions.NORTH:
      if (apple.x > head.x) return "right";
      if (apple.x < head.x) return "left"; 
      break;
    case directions.SOUTH:
      if (apple.x < head.x) return "right";
      if (apple.x > head.x) return "left"; 
      break;
    case directions.EAST:
      if (apple.y > head.y) return "right"; 
      if (apple.y < head.y) return "left";
      break;
    case directions.WEST:
      if (apple.y < head.y) return "right"; 
      if (apple.y > head.y) return "left"; 
      break;
  }
  /***************************
   * END EXAMPLE ALGORITHM *
   ***************************/
  
  return "";  
};
