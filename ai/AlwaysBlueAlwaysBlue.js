var _ = require("lodash");
var elements = require("../lib/elements");
var directions = require("../lib/directions");
var PF = require('pathfinding');
var goRight = true;
var goRightAgain = false;
var goLeftAgain = false;

module.exports.name = "AlwaysBlue";

module.exports.getNextMove = function (game, player) {
    //Get apple location
    var apple = game.board.apple;
    //Get snake head
    var head = player.snake.getHead();
    //Clone board to add obstructions
    var grid0 = _.cloneDeep(game.board.cells);
    try {
        var snake1;
        if(game.players.length > 0)
            snake1 = game.players[0].snake;
        var snake2;
        if(game.players.length > 1)
            snake2 = game.players[1].snake;
        if (snake1) {
            snake1.getPath().forEach(function (obj) {
                grid0[obj.x][obj.y] = "T";
            });
        }
        if (snake2) {
            snake2.getPath().forEach(function(obj) {
                grid0[obj.x][obj.y] = "T";
            });
        }
    } catch (er) {
        console.log(er);
    }

    //console.log(grid0.toString());

    //Map the board to 1s and 0s
    var gridMapped = mapGrid(grid0);
    var gridMappedTrans = _.zip.apply(_, gridMapped);
    var gridPF = new PF.Grid(gridMappedTrans);
    //var gridPF2 = new PF.Grid(gridMappedTrans);

    //Create path finder
    //var finder = new PF.BiBestFirstFinder({
    //    allowDiagonal: false,
    //    dontCrossCorners: false,
    //});
    var finder;
    //var finder2;
    try {
        finder = new PF.BreadthFirstFinder({
            allowDiagonal: false,
        });
        //finder2 = new PF.AStarFinder({
        //    allowDiagonal: false,
        //});
    } catch (er) {
        console.log(er);
    }

    //Find path (start, end, grid)
    var path;
    try {
        path = finder.findPath(head.x, head.y, apple.x, apple.y, gridPF);
        //console.log(path);
    } catch (er) {
        console.log(er);
    }
    if (path == null || path.length == 0) {
        //If a path cannot be found, run "try not to die" logic
        return dontDie(head, gridMapped);

        //console.log("-> path: na");
        //console.log("-> head: " + head.x + "," + head.y + " = " + gridMapped[head.x][head.y]);
        //console.log("-> apple: " + apple.x + "," + apple.y + " = " + gridMapped[apple.x][apple.y]);
        //console.log("-> grid: " + gridMapped.length + "x" + gridMapped[0].length);
        
        //try {
        //    path = finder2.findPath(head.x, head.y, apple.x, apple.y, gridPF2);
        //} catch (er) {
        //    console.log(er);
        //}
        if (path == null || path.length == 0) {
            return "";
        }
    }
    var nextPoint = path[1];
    //console.log("head: " + head.x + "," + head.y);
    //console.log("next: " + nextPoint);
    //console.log("apple: " + apple.x + "," + apple.y);
    //console.log("head direction: " + head.direction.toString());

    //Decide which way to turn
    var dir = whichWay(nextPoint, head, gridMapped);
    //console.log("moved: " + dir.toString());

    //console.log("");
  return dir;  
};

function mapGrid(grid){
    return grid.map(function (data) {
        return data.map(function(value, i) {
            switch (value) {
            case "W":
                return 1;
                break;
            case "B":
                return 0;
                break;
            case "H":
                return 1;
                break;
            case "T":
                return 1;
                break;
            case "A":
                return 0;
                break;
            default:
                return 0;
                break;
            }
        });
    });
};

function whichWay(nextPoint, head, gridMapped) {
    //Right
    if (nextPoint[0] > head.x) {
        //console.log("apple is to the right");
        switch (head.direction) {
            case directions.NORTH:
                return "right";
                break;
            case directions.SOUTH:
                return "left";
                break;
            case directions.WEST:
                //This is tricky
                if (!gridMapped[head.x][head.y - 1])
                    return "right";
                if (!gridMapped[head.x][head.y + 1])
                    return "left";
                return "";
                break;
            case directions.EAST:
                return "";
                break;
        }
    }
    //Left
    if (nextPoint[0] < head.x) {
        //console.log("apple is to the left");
        switch (head.direction) {
            case directions.NORTH:
                return "left";
                break;
            case directions.SOUTH:
                return "right";
                break;
            case directions.WEST:
                return "";
                break;
            case directions.EAST:
                //This is tricky
                if (!gridMapped[head.x][head.y + 1])
                    return "right";
                if (!gridMapped[head.x][head.y - 1])
                    return "left";
                return "";
                break;
        }
    }
    //Below
    if (nextPoint[1] > head.y) {
        //console.log("apple is below");
        switch (head.direction) {
            case directions.NORTH:
                //This is tricky
                if (!gridMapped[head.x + 1][head.y])
                    return "right";
                if (!gridMapped[head.x - 1][head.y])
                    return "left";
                return "";
                break;
            case directions.SOUTH:
                return "";
                break;
            case directions.WEST:
                return "left";
                break;
            case directions.EAST:
                return "right";
                break;
        }
    }
    //Above
    if (nextPoint[1] < head.y) {
        //console.log("apple is above");
        switch (head.direction) {
            case directions.NORTH:
                return "";
                break;
            case directions.SOUTH:
                //This is tricky
                if (!gridMapped[head.x - 1][head.y])
                    return "right";
                if (!gridMapped[head.x + 1][head.y])
                    return "left";
                return "";
                break;
            case directions.WEST:
                return "right";
                break;
            case directions.EAST:
                return "left";
                break;
        }
    }
    //console.log("NA");
    //console.log(head.direction.toString() + "-" + directions.NORTH.toString());
}

function dontDie(head, grid) {
    //No path to apple, try not to hit anything until a path can be found
    //Some sort of zig zag
    
    //Double back
    if (goRightAgain
        && isRightSafe(head.x, head.y, head.direction, grid)){
        //&& !isDeadEnd(head.x, head.y, head.direction, grid)) {
        goRightAgain = false;
        return "right";
    } 
    if (goLeftAgain
        && isLeftSafe(head.x, head.y, head.direction, grid)){
        //&& !isDeadEnd(head.x, head.y, head.direction, grid)) {
        goLeftAgain = false;
        return "left";
    }
    goRightAgain = false;
    goLeftAgain = false;

    //Keep going straight
    if (isNextSafe(head.x, head.y, head.direction, grid)
        && !isDeadEnd(head.x, head.y, head.direction, grid)
        && !isWallTwoAway(head.x, head.y, head.direction, grid))
        return "";
    
    //Alternate turning right then left
    if (goRight
        && isRightSafe(head.x, head.y, head.direction, grid)) {
        goRightAgain = true;
        goRight = !goRight;
        return "right";
    }
    if (!goRight
        && isLeftSafe(head.x, head.y, head.direction, grid)) {
        goLeftAgain = true;
        goRight = !goRight;
        return "left";
    }

    //desperate attempts whichever way is safe
    if (isRightSafe(head.x, head.y, head.direction, grid))
        return "right";
    if (isLeftSafe(head.x, head.y, head.direction, grid))
        return "left";

    //We're screwed
    return "";
}

//Checks if location is empty
function isLocationSafe(x, y, grid) {
    if (!isValidPoint(x, y, grid))
        return false;

    return !grid[x][y];
}

//Checks if the next location (going straight) is empty
function isNextSafe(x, y, direction, grid) {
    switch (direction) {
        case directions.NORTH:
            return (isLocationSafe(x, y - 1, grid))
            break;
        case directions.SOUTH:
            return (isLocationSafe(x, y + 1, grid))
            break;
        case directions.WEST:
            return (isLocationSafe(x - 1, y, grid))
            break;
        case directions.EAST:
            return (isLocationSafe(x + 1, y, grid))
            break;    
    }
    return false;
}

//Checks if the location to the right (based on head direction) is empty
function isRightSafe(x, y, direction, grid) {
    switch (direction) {
        case directions.NORTH:
            return (isLocationSafe(x + 1, y, grid))
            break;  
        case directions.SOUTH:
            return (isLocationSafe(x - 1, y, grid))
            break;
        case directions.WEST:
            return (isLocationSafe(x, y - 1, grid))
            break;
        case directions.EAST:
            return (isLocationSafe(x, y + 1, grid))
            break;   
    }
    return false;
}

//Checks if the location to the left (based on head direction) is empty
function isLeftSafe(x, y, direction, grid) {
    switch (direction) {
        case directions.NORTH:
            return (isLocationSafe(x - 1, y, grid))
            break; 
        case directions.SOUTH:
            return (isLocationSafe(x + 1, y, grid))
            break;
        case directions.WEST:
            return (isLocationSafe(x, y + 1, grid))
            break;
        case directions.EAST:
            return (isLocationSafe(x, y - 1, grid))
            break;
    }
    return false;
}

//Checkouts if next location (going straight) has walls on both sides
function isDeadEnd(x, y, direction, grid) {
    //are we entering a dead end hole
    var dirX = 0;
    var dirY = 0;
    switch (direction) {
    case directions.NORTH:
        dirY = -1;
        break;
    case directions.SOUTH:
        dirY = 1;
        break;
    case directions.WEST:
        dirX = -1;
        break;
    case directions.EAST:
        dirX = 1;
        break;
    }

    var tempX = x + dirX;
    var tempY = y + dirY;
    if (!isLeftSafe(tempX, tempY, direction, grid)
        && !isRightSafe(tempX, tempY, direction, grid)) {
        return true;
    }

    return false;
}

//Checks if the location 2 spaces straigh ahead is empty
function isWallTwoAway(x, y, direction, grid) {
    var dirX = 0;
    var dirY = 0;
    switch (direction) {
        case directions.NORTH:
            dirY = -2;
            break;
        case directions.SOUTH:
            dirY = 2;
            break;
        case directions.WEST:
            dirX = -2;
            break;
        case directions.EAST:
            dirX = 2;
            break;
    }

    var tempX = x + dirX;
    var tempY = y + dirY;
    if (!isValidPoint(tempX, tempY, grid))
        return true;

    if (!isNextSafe(tempX, tempY, direction, grid)) {
        return true;
    }

    return false;
}

//Checks if coordinate is valid
function isValidPoint(x, y, grid) {
    if (x < 0 || x >= grid.length)
        return false;
    if (y < 0 || y >= grid[0].length)
        return false;

    return true;
}
