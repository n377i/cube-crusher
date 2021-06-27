'use strict';

// VARIABLEN
let leftArrow = false;
let rightArrow = false;
let lives = 3;
let bricks = [];
const paddleHeight = 30;
const paddleWidth = paddleHeight * 4;
const marginBottom = 90;
const ballRadius = 16;

// Canvas und Kontext
const game = document.querySelector('#game');
game.width = 800;
game.height = game.width;
const ctx = game.getContext('2d');

// Hintergrund-Verlauf
const drawGameBG = () => {
    let background = ctx.createLinearGradient(0, 0, 0, 800);
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
const paddle = {
    x: (game.width - paddleWidth) / 2,
    y: game.height - paddleHeight - marginBottom,
    w: paddleWidth,
    h: paddleHeight,
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
    roundedRect(
        paddle.x,
        paddle.y,
        paddle.w,
        paddle.h,
        10,
        'white');
}

// Ball
const ball = {
    radius: ballRadius,
    x: game.width / 2,
    y: paddle.y - ballRadius,
    vx: 3 * (Math.random() * 2 - 1), // Zufällige Flugrichtung zwischen -3 und 3.
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
    ctx.closePath();
}

/*
const brick = {
    w: 68,
    h: 68,
    rows: 5,
    cols: 10,
    gap: 8,
    marginLeft: 24,
    marginTop: 24,
    color: '#7addfa'
}

const createBricks = () => {
    for (let r = 0; r < brick.rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.cols; c++) {
            bricks[r][c] = {
                x: c * (brick.w + brick.gap) + brick.marginLeft,
                y: r * (brick.h + brick.gap) + brick.marginTop,
                status: true
            }
        }
    }
}

createBricks();

const drawBricks = () => {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            let b = bricks[r][c];
            if (b.status) {
                    roundedRect(
                        bricks[r][c].x,
                        bricks[r][c].y,
                        brick.w,
                        brick.h,
                        10,
                        brick.color);
            }
        }
    }
}

const brickCollision = () => {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x &&
                    ball.x - ball.radius < b.x + brick.w &&
                    ball.y + ball.radius > b.y &&
                    ball.y - ball.radius < b.y + brick.h) {
                    ball.vy *= -1;
                    b.status = false;
                }
            }
        }
    }
}
*/

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

const movePaddle = () => {
    if (rightArrow && paddle.x + paddle.w < game.width) {
        paddle.x += paddle.speed;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

const resetPaddle = () => {
    paddle.x = (game.width - paddle.w) / 2;
    paddle.y = game.height - paddle.h - marginBottom;
}

const moveBall = () => {
    ball.x += ball.vx;
    ball.y += ball.vy;
}

const resetBall = () => {
    ball.x = game.width / 2;
    ball.y = paddle.y - ballRadius;
    ball.vx = 3 * (Math.random() * 2 - 1);
    ball.vy = -3;
}

// Kollisionsabfrage Wand
const wallCollision = () => {
    // Wenn der Ball mit der linken oder rechten Wand kollidiert, wird der vx-Wert umgekehrt.
    if ((ball.x + ball.radius > game.width) ||
        (ball.x - ball.radius < 0))
        ball.vx *= -1;
    // Wenn der Ball mit der Decke kollidiert, wird der vy-Wert umgekehrt.
    if (ball.y - ball.radius < 0)
        ball.vy *= -1;
    // Wenn der Ball mit dem Boden kollidiert, verliert der Spieler ein Leben, Paddle und Ball werden zurückgesetzt.
    if (ball.y + ball.radius > game.height - marginBottom) {
        lives--;
        resetPaddle();
        resetBall();
    }
}

// Kollisionsabfrage Paddle
const paddleCollision = () => {
    // Prüfen, wo der Ball auftrifft.
    let collisionPoint = ball.x - (paddle.x + paddle.w / 2); // Ballmitte - Paddlemitte
    collisionPoint /= (paddle.w / 2); // Normierung -> Ergibt Werte zwischen -1 und 1
    let reboundAngle = collisionPoint * (Math.PI / 3); // Abprall-Winkel = Kollisionspunkt * 60° 

    // Wenn der Ball mit dem Paddle kollidiert, ergibt die Geschwindigkeit * dem Sinus vom Abprall-Winkel den neuen vx-Wert
    // und die dekrementierte Geschwindigkeit * dem Cosinus vom Abprall-Winkel den neuen vy-Wert.
    if (ball.y + ball.radius > paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w
    ) {
        ball.vx = ball.speed * Math.sin(reboundAngle);
        ball.vy = -ball.speed * Math.cos(reboundAngle);
    }
}

const update = () => {
    movePaddle();
    moveBall();
    wallCollision();
    paddleCollision();
    //brickCollision();
}

const draw = () => {
    drawGameBG();
    drawPaddle();
    drawBall();
    //drawBricks();
}

// INIT
const init = () => {
    ctx.clearRect(0, 0, game.width, game.height);
    draw();
    update();
    requestAnimationFrame(init); // ruft vor jedem erneuten Rendern des Browserfensters die Animations-Funktion auf - effizienter als Zeitintervalle.
}

const roundedRect = (x, y, w, h, radius, color) => {
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

init();
