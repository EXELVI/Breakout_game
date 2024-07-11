const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 100;
const paddleHeight = 10;
const paddleMarginBottom = 50;
const ballRadius = 8;
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let leftArrow = false;
let rightArrow = false;

const paddle = {
    x: (canvas.width - paddleWidth) / 2,
    y: canvas.height - paddleHeight - paddleMarginBottom,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5
};
 
const ball = {
    x: canvas.width / 2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
};

const bricks = [];
for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[r][c] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowRight" || event.key == "Right") {
        rightArrow = true;
    } else if (event.key == "ArrowLeft" || event.key == "Left") {
        leftArrow = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key == "ArrowRight" || event.key == "Right") {
        rightArrow = false;
    } else if (event.key == "ArrowLeft" || event.key == "Left") {
        leftArrow = false;
    }
});

function drawPaddle() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.fillStyle = "#0095DD";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < canvas.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.y + ball.radius > canvas.height) {
        alert("GAME OVER");
        var restart = confirm("Do you want to restart?");
        if (restart) {
            document.location.reload();
            clearInterval(interval);
          
        } else {
            clearInterval(interval);
        }
    }

    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.radius > paddle.y) {
        ball.dy = -ball.speed;
    }
}

function collisionDetection() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            const b = bricks[r][c];
            if (b.status == 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy *= -1;
                    b.status = 0;
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    collisionDetection();
}

function update() {
    movePaddle();
    moveBall();
    draw();

    requestAnimationFrame(update);
}

