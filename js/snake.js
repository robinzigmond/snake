var running = false;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var blockSize = 20; // no. of pixels per square "block". A number of such blocks will make up the play area.
var widthInBlocks = 50;
var heightInBlocks = 25;

// a dictionary of values to translate directions to x, y co-ordinate values:
var directions = {
    North: {x: 0, y: -1},
    East: {x: 1, y: 0},
    South: {x: 0, y: +1},
    West: {x: -1, y: 0}
};

var startSnake = {
    segments: [{xPos: Math.floor(widthInBlocks/2), yPos: Math.floor(heightInBlocks/2)}],
    direction: "East",
    framesPerMove: 9,
    frameCount: 0,
    maxLength: 1
};
// make a "copy" of the object so that changes to one do not effect the other
var snake = JSON.parse(JSON.stringify(startSnake));

var foodRequired = true;
var foodPosition = {x: undefined, y: undefined};

var keys = [];
document.body.addEventListener("keydown", function(e) {
    event.preventDefault();
	keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
    event.preventDefault();
	keys[e.keyCode] = false;
});


function clearCanvas() {
	ctx.clearRect(0, 0, widthInBlocks*blockSize, heightInBlocks*blockSize);
}


function drawSnake() {
    ctx.fillStyle = "red";
    snake.segments.forEach(function(segment) {
        ctx.fillRect(segment.xPos*blockSize, segment.yPos*blockSize, blockSize, blockSize);
    });
    ctx.fill();
}


function moveSnake() {
    // ensure the player isn't allowed to go directly back on him/herself
    if (keys[37] && snake.direction != "East") {
        snake.direction = "West";
    }
    if (keys[38] && snake.direction != "South") {
        snake.direction = "North";
    }
    if (keys[39] && snake.direction != "West") {
        snake.direction = "East";
    }
    if (keys[40] && snake.direction != "North") {
        snake.direction = "South";
    }

    if (snake.frameCount >= snake.framesPerMove) {
        // add in new block at front of snake
        var front = snake.segments[snake.segments.length-1];
        var newSegment = {
            xPos: front.xPos + directions[snake.direction].x,
            yPos: front.yPos + directions[snake.direction].y
        };
        snake.segments.push(newSegment);
        
        // increase maxLength (and, indirectly, the score!) if the snake got to the food
        var front = snake.segments[snake.segments.length-1]; // this is the same as line 71 might want to change ?
        if (front.xPos==foodPosition.x && front.yPos==foodPosition.y) {
            foodRequired = true;
            snake.maxLength++;
            snake.framesPerMove = Math.max(9 - snake.maxLength/10, 2);
        }

        // remove block at back if snake is at max length
        if (snake.segments.length>snake.maxLength) {
            snake.segments.shift();
        }

        // end the game if front of snake hits wall, or any of its own segments!
        if (front.xPos>=widthInBlocks || front.yPos>=heightInBlocks || front.xPos<0 || front.yPos<0) {
            quit();
            bootbox.alert("Oops, you hit the wall! Better luck next time.");
        }
        else {snake.segments.forEach(function(segment, index) {
                // obviously don't penalise the player for the front of the snake hitting itself!
                if (front != segment && front.xPos == segment.xPos && front.yPos == segment.yPos) {
                    quit();
                    bootbox.alert("Your snake got too long - or maybe you were too slow. Either way, it hit itself! Better luck next time.");
                }
            });
        }
        snake.frameCount = 0;
    }
    /* move proportionally towards the next destination (for smoother animation)
    in practice this seems to make silly things happen (the snake is far too fast and never actually picks
    up the food, even when I change that check from strict equality to "be within 0.5") - so it is commented
    out, perhaps never to return! */
    /*snake.segments.forEach(function(segment, index){
        var nextSegment = index==snake.segments.length-1 ? {xPos: segment.xPos + directions[snake.direction].x, 
                                                        yPos: segment.yPos + directions[snake.direction].y} 
                                                        : snake.segments[index+1];
        segment.xPos += snake.frameCount * (nextSegment.xPos-segment.xPos) / snake.framesPerMove;
        segment.yPos += snake.frameCount * (nextSegment.yPos-segment.yPos) / snake.framesPerMove;
    });*/

    snake.frameCount++;
}


function food() {
    while (foodRequired) {
        var positionOK = true;
        newFoodXPos = Math.floor(widthInBlocks*Math.random());
        newFoodYPos = Math.floor(heightInBlocks*Math.random());
        
        // new food block can't be anywhere on current snake, because that would be silly
        snake.segments.forEach(function(segment) {
            if (newFoodXPos==segment.xPos && newFoodYPos==segment.yPos) {
                positionOK = false;
            }
        });
        if (positionOK) {
            foodPosition = {x: newFoodXPos, y: newFoodYPos};
            foodRequired = false;
        }
    }
    ctx.fillStyle = "green";
    ctx.fillRect(foodPosition.x*blockSize, foodPosition.y*blockSize, blockSize, blockSize);
    ctx.fill();
}


function score() {
    document.getElementById("score").innerText = snake.maxLength - 1;
}


function startGame() {
    running = true;
    snake = JSON.parse(JSON.stringify(startSnake));
    // make sure all keys count as not pressed - this can matter when restarting the game
    keys[37] = false;
    keys[38] = false;
    keys[39] = false;
    keys[40] = false;
    gameLoop();
}


function quit() {
    running = false;
    foodRequired = true;
    foodPosition = {x: undefined, y: undefined};
}


function gameLoop() {
    if (running) {
        if (snake.frameCount >= snake.framesPerMove || foodRequired) {
            clearCanvas(); // only update screen when needed, in a mostly futile attempt to stop "flickering"
        }  // when speed is low
        food();
        moveSnake();
        drawSnake();
        if (running) { /* despite appearances, this conditional is not pointless. It ensures that the score is
            not reset to 0 until the player restarts the game - so that the previous score can still be seen */
            score();
            requestAnimationFrame(gameLoop);
        }
    }
}
