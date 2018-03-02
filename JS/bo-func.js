//Setting up the canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//Starting placement and movement of ball

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

//dimensions of ball and paddle
const ballRadius = 6;
const betterBounce = ballRadius/2;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

//keypress
let rightPressed = false;
let leftPressed = false;

//bricks
var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 45;
var brickHeight = 10;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
//brick layout

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}
//scoring
let score = 0;

//lives 
let lives = 3;

//key press event listeners

document.addEventListener("keydown", keyDownHandler, false);

document.addEventListener("keyup", keyUpHandler, false);

//listening for mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

//anchoring mouse to paddle
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
//printing the bricks

let drawBricks = () => {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#D54925";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//drawing the ball

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#5FC3DA";
    ctx.fill();
    ctx.closePath();
}

// drawing the paddle

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#E07849";
    ctx.fill();
    ctx.closePath();
}

//running the game.  Calling functions, moving ball. 

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas, to allow new position of ball. 
    drawBricks(); //Adds bricks
    drawBall(); //draws ball
    drawPaddle(); //draws paddle
    drawScore(); //displays score
    drawLives(); //Lives
    collisionDectection(); //calls collision func
    

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx
    } //cause side bounce
    if (y + dy < ballRadius) {
        dy = -dy; //cause bounce top
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy; //cause bounce off paddle
        } 
        else {
            lives--; //subtracts a life
            if (!lives) {
                alert("Game Over!");
                document.location.reload();
            } //no lives left Game over.
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }

        }

    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7; //moves paddle seven px right. 
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    } //moves paddle seven px left. 

};



//keyboard functions 

function keyDownHandler(e) { //identifies the right arrow push
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) { //and left key
        leftPressed = true;
    }
}

function keyUpHandler(e) { //release of right arrow
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false; //left arrow 
    }
}

//ball brick interaction 

let collisionDectection = () => {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0; //changes the status of the brick upon collision, so it won't be drawn. 
                    score++; //adds a point to the score for each collision.  
                    if (score == brickRowCount * brickColumnCount) {
                        alert("You, win, Nice Work!!");
                        document.location.reload(); //calls alert if all the bricks disappear.  
                    }
                }
            }
        }
    }
    x += dx; //changes x location 
    y += dy; //changes y location 
    requestAnimationFrame(draw);
}

//including the score 

let drawScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E07849";
    ctx.fillText("Score: " + score, 8, 20);
}

//including lives
let drawLives = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E07849";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
//speed of the ball/refresh

draw();
