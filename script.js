'use strict';

// VARIABLEN
const paddleHeight = 30;
const paddleWidth = paddleHeight * 4;
const marginBottom = 90;
const ballRadius = 16;
let leftArrow = false;
let rightArrow = false;
let life = 3;

// Canvas und Kontext definieren.
const game = document.querySelector('#game');
game.width = 800;
game.height = game.width;
const ctx = game.getContext('2d');

// Hintergrund-Verlauf zeichnen.
const drawGameBG = () => {
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

const drawScoreBG = () => {
    ctx.fillStyle = '#111';
    ctx.fillRect(
        0,
        game.height - marginBottom,
        game.width,
        marginBottom
    );
}

// Paddle
const paddle = {
    h: paddleHeight,
    w: paddleWidth,
    x: (game.width - paddleWidth) / 2,
    y: game.height - paddleHeight - marginBottom,
    speed: 6
}

const drawPaddle = () => {
    /*ctx.fillStyle = 'white';
    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.w,
        paddle.h
    );*/
    roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 10, 'white');
}

// Ball
const ball = {
    radius: ballRadius,
    x: game.width / 2,
    y: paddle.y - ballRadius,
    vx: 3 * (Math.random() * 2 - 1),
    vy: -3,
    speed: 4
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
    //ctx.strokeStyle = 'white';
    //ctx.stroke();
    ctx.closePath();
}

// Steuerung
document.addEventListener('keydown', function (evt) {
    if (evt.keyCode == 37) {
        leftArrow = true;
    } else if (evt.keyCode == 39) {
        rightArrow = true;
    }
})

document.addEventListener('keyup', function (evt) {
    if (evt.keyCode == 37) {
        leftArrow = false;
    } else if (evt.keyCode == 39) {
        rightArrow = false;
    }
})

/*
document.addEventListener('mousemove', function (evt) {
    var relativeX = evt.clientX - game.offsetLeft;
    if ( relativeX > 0 && relativeX < game.width ) {
        paddle.x = relativeX - paddle.w / 2;
    }
    });
*/

const movePaddle = () => {
    if (rightArrow && paddle.x + paddle.w < game.width) {
        paddle.x += paddle.speed;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

const moveBall = () => {
    ball.x += ball.vx;
    ball.y += ball.vy;
}

const resetBall = () => {
    ball.x = game.width / 2;
    ball.y = paddle.y - ballRadius;
    ball.vx = 3 * (Math.random() * 2 - 1)
    ball.vy = -3;
}

// Kollisionsabfrage Wand
const wallCollision = () => {
    if (ball.x + ball.radius > game.width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
    }
    if (ball.y - ball.radius < 0) {
        ball.vy = -ball.vy;
    }
    if (ball.y + ball.radius > game.height - marginBottom) {
        life--;
        resetBall();
    }
}

// Kollisionsabfrage Paddle
const paddleCollision = () => {
    if (ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.radius > paddle.y &&
        ball.y + ball.radius < paddle.y + paddle.h
    ) {
        let collisionPoint = ball.x - (paddle.x + paddle.w / 2);
        collisionPoint = collisionPoint / (paddle.w / 2);
        let angle = collisionPoint * (Math.PI / 3); // 60° 
        ball.vx = ball.speed * Math.sin(angle);
        ball.vy = -ball.speed * Math.cos(angle);
    }
}

const update = () => {
    movePaddle();
    moveBall();
    wallCollision();
    paddleCollision();
}

const draw = () => {
    drawGameBG();
    drawScoreBG();
    
        // Reihe 1
        roundRect(59, 59, 80, 80, 10, '#ee1c25');
        roundRect(145, 60, 80, 80, 10);
        roundRect(231, 60, 80, 80, 10);
        roundRect(317, 60, 80, 80, 10);
        roundRect(403, 60, 80, 80, 10);
        roundRect(489, 60, 80, 80, 10);
        roundRect(575, 60, 80, 80, 10);
        roundRect(661, 60, 80, 80, 10);

        // Reihe 2
        roundRect(59, 145, 80, 80, 10, '#f48221');
        roundRect(145, 146, 80, 80, 10);
        roundRect(231, 146, 80, 80, 10);
        roundRect(317, 146, 80, 80, 10);
        roundRect(403, 146, 80, 80, 10);
        roundRect(489, 146, 80, 80, 10);
        roundRect(575, 146, 80, 80, 10);
        roundRect(661, 146, 80, 80, 10);

        // Reihe 3
        roundRect(59, 231, 80, 80, 10, '#ffe700');
        roundRect(145, 232, 80, 80, 10);
        roundRect(231, 232, 80, 80, 10);
        roundRect(317, 232, 80, 80, 10);
        roundRect(403, 232, 80, 80, 10);
        roundRect(489, 232, 80, 80, 10);
        roundRect(575, 232, 80, 80, 10);
        roundRect(661, 232, 80, 80, 10);
        
        // Reihe 4
        roundRect(59, 317, 80, 80, 10, '#8ec63d');
        roundRect(145, 318, 80, 80, 10);
        roundRect(231, 318, 80, 80, 10);
        roundRect(317, 318, 80, 80, 10);
        roundRect(403, 318, 80, 80, 10);
        roundRect(489, 318, 80, 80, 10);
        roundRect(575, 318, 80, 80, 10);
        roundRect(661, 318, 80, 80, 10);
    
    drawPaddle();
    drawBall();
}

// Game Loop
const loop = () => {
    draw();
    update();
    requestAnimationFrame(loop);
}

const roundRect = (x, y, w, h, radius, color) => {
    let r = x + w;
    let b = y + h;
    ctx.beginPath();
    ctx.fillStyle = color;
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

loop();
