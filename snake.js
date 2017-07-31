var running = false;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var blockSize = 20; // no. of pixels per square "block". A number of such blocks will make up the play area.
var widthInBlocks = 50;
var heightInBlocks = 30;

// a dictionary of values to translate directions to x, y co-ordinate values:
var directions = {
    North: {x: 0, y: -1},
    East: {x: 1, y: 0},
    South: {x: 0, y: +1},
    West: {x: -1, y: 0}
}

var startSnake = {
    segments: [{xPos: Math.floor(widthInBlocks/2), yPos: Math.floor(heightInBlocks/2)}],
    direction: "East",
    framesPerMove: 20,
    frameCount: 0,
    maxLength: 1
};
var snake = startSnake;

var foodRequired = true;
var foodPosition = {x: undefined, y: undefined}

var keys = [];
document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
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
    if (keys[37]) {
        snake.direction = "West";
    }
    if (keys[38]) {
        snake.direction = "North";
    }
    if (keys[39]) {
        snake.direction = "East";
    }
    if (keys[40]) {
        snake.direction = "South";
    }

    if (snake.frameCount >= snake.framesPerMove) {
        // add in new block at front of snake
        var front = snake.segments[snake.segments.length-1];
        var newSegment = {
            xPos: front.xPos + directions[snake.direction].x,
            yPos: front.yPos + directions[snake.direction].y
        }
        snake.segments.push(newSegment);

        // increase maxLength (and, indirectly, the score!) if the snake got to the food
        var front = snake.segments[snake.segments.length-1];
        if (front.xPos==foodPosition.x && front.yPos==foodPosition.y) {
            foodRequired = true;
            snake.maxLength++;
            if (snake.framesPerMove > 0) {
                snake.framesPerMove --;
            }
        }

        // remove block at back if snake is at max length
        if (snake.segments.length>snake.maxLength) {
            snake.segments.shift();
        }

        // end the game if front of snake hits wall, or any of its own segments!
        if (front.xPos>widthInBlocks || front.yPos>heightInBlocks || front.xPos<0 || front.yPos<0) {
            quit;
            alert("You hit the wall, sucker! Better luck next time.");
        }
        snake.segments.forEach(function(segment, index) {
            // obviously don't penalise the player for the front of the snake hitting itself!
            if (front != segment && front.xPos == segment.xPos && front.yPos == segment.yPos) {
                quit();
                alert("Your snake got too slow, or maybe too fat. Either way, it hit itself! Better luck next time.");
            }
        });
        snake.frameCount = 0;
    }
    snake.frameCount++
}


function food() {
    while (foodRequired) {
        var positionOK = true;
        newFoodXPos = Math.floor(widthInBlocks*Math.random());
        newFoodYPos = Math.floor(heightInBlocks*Math.random());
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
    gameLoop();
}


function quit() {
    running = false;
    snake = startSnake;
}


function gameLoop() {
    if (running) {
        clearCanvas();
        food();
        drawSnake();
        moveSnake();
        score();
        requestAnimationFrame(gameLoop);
    }
}
