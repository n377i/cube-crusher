'use strict';

// VARIABLEN
let leftArrow = false;
let rightArrow = false;
let lives = 3;
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
    roundRect(
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
    // Wenn der Ball mit der linken oder rechten Wand kollidiert, wird der vx-Wert dekrementiert bzw. inkrementiert.
    if ((ball.x + ball.radius > game.width) ||
        (ball.x - ball.radius < 0)) 
        ball.vx *= -1; 
    // Wenn der Ball mit der Decke kollidiert, wird der vy-Wert inkrementiert.
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
    // Der Abprall-Winkel hängt davon ab, an welchem Punkt der Ball auf das Paddle trifft.
    let collisionPoint = ball.x - (paddle.x + paddle.w / 2); // Ballmitte - Paddlemitte
    collisionPoint /= (paddle.w / 2); // Ergibt Werte zwischen -1 und 1.
    let angle = collisionPoint * (Math.PI / 3); // Kollisionspunkt * 60° 

    if (ball.y + ball.radius > paddle.y && // Wenn die untere Ballseite die obere Paddleseite übersteigt und
        ball.x >= paddle.x && // die Ballmitte nicht über die linke Paddleseite und
        ball.x <= paddle.x + paddle.w // nicht über die rechte Paddleseite hinausragt,
    ) {
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
/*
    // Reihe 1
    roundRect(23, 23, 70, 70, 10, '#fe4109');
    roundRect(99, 23, 70, 70, 10);
    roundRect(175, 23, 70, 70, 10);
    roundRect(251, 23, 70, 70, 10);
    roundRect(327, 23, 70, 70, 10);
    roundRect(403, 23, 70, 70, 10);
    roundRect(479, 23, 70, 70, 10);
    roundRect(555, 23, 70, 70, 10);
    roundRect(631, 23, 70, 70, 10);
    roundRect(707, 23, 70, 70, 10);

    // Reihe 2
    roundRect(23, 99, 70, 70, 10, '#fe9901');
    roundRect(99, 99, 70, 70, 10);
    roundRect(175, 99, 70, 70, 10);
    roundRect(251, 99, 70, 70, 10);
    roundRect(327, 99, 70, 70, 10);
    roundRect(403, 99, 70, 70, 10);
    roundRect(479, 99, 70, 70, 10);
    roundRect(555, 99, 70, 70, 10);
    roundRect(631, 99, 70, 70, 10);
    roundRect(707, 99, 70, 70, 10);

    // Reihe 3
    roundRect(23, 175, 70, 70, 10, '#f5e900');
    roundRect(99, 175, 70, 70, 10);
    roundRect(175, 175, 70, 70, 10);
    roundRect(251, 175, 70, 70, 10);
    roundRect(327, 175, 70, 70, 10);
    roundRect(403, 175, 70, 70, 10);
    roundRect(479, 175, 70, 70, 10);
    roundRect(555, 175, 70, 70, 10);
    roundRect(631, 175, 70, 70, 10);
    roundRect(707, 175, 70, 70, 10);

    // Reihe 4
    roundRect(23, 251, 70, 70, 10, '#a3db00');
    roundRect(99, 251, 70, 70, 10);
    roundRect(175, 251, 70, 70, 10);
    roundRect(251, 251, 70, 70, 10);
    roundRect(327, 251, 70, 70, 10);
    roundRect(403, 251, 70, 70, 10);
    roundRect(479, 251, 70, 70, 10);
    roundRect(555, 251, 70, 70, 10);
    roundRect(631, 251, 70, 70, 10);
    roundRect(707, 251, 70, 70, 10);

    // Reihe 5
    roundRect(23, 327, 70, 70, 10, '#7addfa');
    roundRect(99, 327, 70, 70, 10);
    roundRect(175, 327, 70, 70, 10);
    roundRect(251, 327, 70, 70, 10);
    roundRect(327, 327, 70, 70, 10);
    roundRect(403, 327, 70, 70, 10);
    roundRect(479, 327, 70, 70, 10);
    roundRect(555, 327, 70, 70, 10);
    roundRect(631, 327, 70, 70, 10);
    roundRect(707, 327, 70, 70, 10);
*/
    drawPaddle();
    drawBall();
}

// Game Loop
const init = () => {
    ctx.clearRect(0, 0, game.width, game.height);
    draw();
    update();
    requestAnimationFrame(init); // ruft vor jedem erneuten Rendern des Browserfensters die Animations-Funktion auf - effizienter als Zeitintervalle.
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

init();
