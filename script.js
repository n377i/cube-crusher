'use strict';

// VARIABLEN
let life = 3;

// Canvas definieren.
const game = document.querySelector('#game');
game.width = 800;
game.height = game.width;

// Kontext definieren.
const ctx = game.getContext('2d');

// Paddle
const paddleHeight = 30;
const paddleWidth = paddleHeight * 4;
const paddleX = (game.width - paddleWidth) / 2;
const paddleY = (game.height - paddleHeight) - 67;
const marginBottom = 90;
const paddle = {
    h: paddleHeight,
    w: paddleWidth,
    x: (game.width - paddleWidth) / 2,
    y: (game.height - paddleHeight) - marginBottom
}

// Hintergrund-Verlauf zeichnen.
const drawBackground = () => {
    let background = ctx.createLinearGradient(0, 0, 0, 1000);
    background.addColorStop(0, '#111');
    background.addColorStop(1, '#333');
    ctx.fillStyle = background;
    ctx.fillRect(
        0,
        0,
        game.width,
        game.height - marginBottom
    );
}

const drawPaddle = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.w,
        paddle.h
    );
}

// Ball
const ballRadius = 16;
const ball = {
    radius: ballRadius,
    x: game.width / 2,
    y: paddle.y - ballRadius,
    speedX: 3,
    speedY: -3
}

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();
}

const moveBall = () => {
    ball.x += speedX;
    ball.y += speedY;
}

const wallCollision = () => {
    if ((ball.x + ball.radius) > game.width || (ball.x - ball.radius < 0)) {
        ball.speedX = -ball.speedX;
    }
    if ((ball.y + ball.radius) < 0) {
        ball.speedY = -ball.speedY;
    }
    if ((ball.y + ball.radius) > game.height) {
        life--;
        resetBall();
    }
}

const resetBall = () => {
    ball.x = game.width / 2;
    ball.y = paddle.y - ballRadius;
    ball.speedX = 3 * (Math.random() * 2 - 1)
    ball.speedY = -3;
}

// Game Loop
const loop = () => {
    ctx.clear(
        0,
        0,
        game.width,
        game.height)

    draw();
    update();

    requestAnimationFrame(loop);
}

const init = () => {
    drawBackground();
    /*
        roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 10);

        // Reihe 1
        roundRect(59, 59, 80, 80, 10);
        roundRect(145, 60, 80, 80, 10);
        roundRect(231, 60, 80, 80, 10);
        roundRect(317, 60, 80, 80, 10);
        roundRect(403, 60, 80, 80, 10);
        roundRect(489, 60, 80, 80, 10);
        roundRect(575, 60, 80, 80, 10);
        roundRect(661, 60, 80, 80, 10);

        // Reihe 2
        roundRect(59, 145, 80, 80, 10);
        roundRect(145, 146, 80, 80, 10);
        roundRect(231, 146, 80, 80, 10);
        roundRect(317, 146, 80, 80, 10);
        roundRect(403, 146, 80, 80, 10);
        roundRect(489, 146, 80, 80, 10);
        roundRect(575, 146, 80, 80, 10);
        roundRect(661, 146, 80, 80, 10);

        // Reihe 3
        roundRect(59, 231, 80, 80, 10);
        roundRect(145, 232, 80, 80, 10);
        roundRect(231, 232, 80, 80, 10);
        roundRect(317, 232, 80, 80, 10);
        roundRect(403, 232, 80, 80, 10);
        roundRect(489, 232, 80, 80, 10);
        roundRect(575, 232, 80, 80, 10);
        roundRect(661, 232, 80, 80, 10);
        
        // Reihe 4
        roundRect(59, 317, 80, 80, 10);
        roundRect(145, 318, 80, 80, 10);
        roundRect(231, 318, 80, 80, 10);
        roundRect(317, 318, 80, 80, 10);
        roundRect(403, 318, 80, 80, 10);
        roundRect(489, 318, 80, 80, 10);
        roundRect(575, 318, 80, 80, 10);
        roundRect(661, 318, 80, 80, 10);
    */
    drawPaddle();
    drawBall();
}

const roundRect = (x, y, w, h, radius) => {
    let r = x + w;
    let b = y + h;
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();
}

init();
