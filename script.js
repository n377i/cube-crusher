'use strict';

// VARIABLEN
let leftArrow = false;
let rightArrow = false;
let bricks = [];
let score = 0;
let pointsPerBrick = 5;
let scoreIcon = new Image();
scoreIcon.src = 'img/score.png';
let lives = 3;
let livesIcon = new Image();
livesIcon.src = 'img/lives.png';
let highScore = 0;
let highScoreIcon = new Image();
highScoreIcon.src = 'img/highscore.png';
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
    speed: 5
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

// Brick
const brick = {
    w: 68,
    h: 68,
    rows: 2,
    cols: 10,
    gap: 8,
    marginLeft: 24,
    marginTop: 24,
    color: '#bbb'
}

/*
let brickColors = ['#fe4109', '#fe9901', '#f5e900', '#a3db00', '#7addfa']
let getColor = brickColors[Math.floor(Math.random() * brickColors.length)]
*/

// Steine positionieren
const createBricks = () => {
    // Zeilen
    for (let r = 0; r < brick.rows; r++) {
        bricks[r] = [];
        // Spalten
        for (let c = 0; c < brick.cols; c++) {
            // Zweidimensionales Array
            bricks[r][c] = {
                x: c * (brick.w + brick.gap) + brick.marginLeft,
                y: r * (brick.h + brick.gap) + brick.marginTop,
                status: true // Stein wurde noch nicht vom Ball getroffen.
            }
        }
    }
}

// Steine zeichnen, die noch nicht vom Ball getroffen wurden.
const drawBricks = () => {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            if (bricks[r][c].status) {
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
    // Wenn der Ball mit dem Boden kollidiert, verliert der Spieler ein Leben, Paddle, Ball und Ball-Geschwindigkeit werden zurückgesetzt.
    if (ball.y + ball.radius > game.height - marginBottom) {
        lives--;
        resetPaddle();
        resetBall();
        ball.speed = 5;
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

// Kollisionsabfrage Stein
const brickCollision = () => {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            if (bricks[r][c].status) {
                // Wenn der Ball mit dem Stein kollidiert, wird der vy-Wert umgekehrt und der Stein verschwindet.
                if (ball.x + ball.radius > bricks[r][c].x &&
                    ball.x - ball.radius < bricks[r][c].x + brick.w &&
                    ball.y + ball.radius > bricks[r][c].y &&
                    ball.y - ball.radius < bricks[r][c].y + brick.h) {
                    ball.vy *= -1;
                    ball.speed += 0.1;
                    score += pointsPerBrick;
                    bricks[r][c].status = false;
                }
            }
        }
    }
}

// Punkte, Leben und HighScore zeichnen
const drawGameStats = (img, imgX, imgY, text, textX, textY) => {
    ctx.drawImage(img, imgX, imgY, 44, 44);
    ctx.fillStyle = 'white'
    ctx.font = '44px Bebas Neue';
    ctx.fillText(text, textX, textY);
}

let gameOver = false;
let win = false;

// Spiel veloren
const gameLost = () => {
    // Wenn alle Leben verbraucht sind, erscheint das Loser Pop-up.
    if (!lives) {
        gameOver = true;
        document.getElementById('loser').classList.remove('hidepopup');
        document.getElementById('resultloser').textContent = `Du hast immerhin ${score} Punkte erreicht!`;

        // Bei Klick auf "Nochmal spielen" verschwindet das Winner Pop-up und das Spiel wird neu geladen.
        const newChance = document.querySelector("#newchance");
        newChance.addEventListener('click', function () {
            document.getElementById('loser').classList.add('hidepopup');
            document.location.reload();
        });
        // Falls es einen neuen Highscore gibt, wird dieser gespeichert.
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', score);
        }
    }
}

// Spiel gewonnen
const gameWon = () => {
    // Wenn alle Steine zerstört wurden, erscheint das Winner Pop-up.
    win = true;
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            win = win && !bricks[r][c].status
        }
    }
    if (win) {
        gameOver = true;
        document.getElementById('winner').classList.remove('hidepopup');
        document.getElementById('resultwinner').textContent = `Du hast ${score} Punkte erreicht!`;

        // Bei Klick auf "Nochmal spielen" verschwindet das Winner Pop-up und das Spiel wird neu geladen.
        const newGame = document.querySelector("#newgame");
        newGame.addEventListener('click', function () {
            document.getElementById('winner').classList.add('hidepopup');
            document.location.reload();
        });
        // Falls es einen neuen Highscore gibt, wird dieser gespeichert.
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', score);
        }
    }
}

const update = () => {
    movePaddle();
    moveBall();
    wallCollision();
    paddleCollision();
    brickCollision();
    gameLost();
    gameWon();
}

const draw = () => {
    drawGameBG();
    drawBricks();
    drawPaddle();
    drawBall();
    drawGameStats(scoreIcon, 24, game.height - 66, score, 80, game.height - 28);
    drawGameStats(livesIcon, game.width / 2 - 38, game.height - 66, lives, game.width / 2 + 18, game.height - 28);
    drawGameStats(highScoreIcon, game.width - 132, game.height - 66, highScore, game.width - 76, game.height - 28);
}

const roundedRect = (x, y, w, h, radius, color) => {
    let a = x + w;
    let b = y + h;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(a - radius, y);
    ctx.quadraticCurveTo(a, y, a, y + radius);
    ctx.lineTo(a, y + h - radius);
    ctx.quadraticCurveTo(a, b, a - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();
    ctx.closePath();
}

const init = () => {
    // Highscore laden
const scoreStr = localStorage.getItem('highScore');
if (scoreStr == null) {
    highScore = 0;
} else {
    highScore = scoreStr;
}
createBricks();
gameLoop();
}

// Spielschleife
const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height);
    draw();
    update();
    if (!gameOver) {
        requestAnimationFrame(gameLoop); // ruft vor jedem erneuten Rendern des Browserfensters die Animations-Funktion auf - effizienter als Zeitintervalle.
    }
}

init();
