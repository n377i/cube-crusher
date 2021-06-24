'use strict';

// Canvas definieren.
const game = document.querySelector('#game');
game.width = 800;
game.height = game.width;

// Kontext definieren.
const ctx = game.getContext('2d');

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

// Paddle
const paddleHeight = 24;
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
const ballRadius = 15;
const ball = {
    x: game.width / 2,
    y: paddle.y - ballRadius,
    radius: ballRadius
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
    drawPaddle();
    drawBall();
}

init();
