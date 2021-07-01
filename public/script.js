'use strict';

// VARIABLEN

let score = 0;
let pointsPerBrick = [25, 20, 15, 10, 5];
let scoreIcon = new Image();
scoreIcon.src = 'img/score.png';
let lives = 3;
let livesIcon = new Image();
livesIcon.src = 'img/lives.png';
let level = 1;
let levelIcon = new Image();
levelIcon.src = 'img/level.png';
let highScore = 2000;
let highScoreIcon = new Image();
highScoreIcon.src = 'img/highscore.png';
let leftArrow = false;
let rightArrow = false;
let gameOver = false;
let levelComplete = false;
let marginBottom = 90;
let paddleWidth = 120;
let paddleHeight = 30;
let ballRadius = 16;
let bricks = [];
let brickColors = ['#fe4109', '#fe9901', '#f5e900', '#a3db00', '#7addfa'];

// Canvas und Kontext
const game = document.querySelector('#game');
game.width = 800;
game.height = game.width;
const ctx = game.getContext('2d');

// Schläger
const paddle = {
    x: (game.width - paddleWidth) / 2,
    y: game.height - paddleHeight - marginBottom,
    w: paddleWidth,
    h: paddleHeight,
    speed: 5
}

// Ball
const ball = {
    radius: ballRadius,
    x: game.width / 2,
    y: paddle.y - ballRadius,
    vx: 4 * (Math.random() * 2 - 1), // Zufällige Flugrichtung zwischen -3 und 3.
    vy: -4,
    speed: 5
}

// Stein
const brick = {
    w: 68,
    h: 68,
    rows: 1,
    cols: 10,
    gap: 8,
    marginLeft: 24,
    marginTop: 24,
}


// FUNKTIONEN

// Hintergrund-Verlauf zeichnen
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

// Punkte, Leben, Level und HighScore zeichnen
const drawGameStats = (img, imgX, imgY, text, textX, textY) => {
    ctx.drawImage(img, imgX, imgY, 44, 44);
    ctx.fillStyle = 'white'
    ctx.font = '44px Bebas Neue';
    ctx.fillText(text, textX, textY);
}

// Runde Ecken für Schläger und Steine
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

// Schläger zeichnen
const drawPaddle = () => {
    roundedRect(
        paddle.x,
        paddle.y,
        paddle.w,
        paddle.h,
        10,
        'white');
}

// Ball zeichnen
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
                    brickColors[r]);
            }
        }
    }
}

// Schläger Steuerung
const movePaddle = () => {
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
    // Das Paddle lässt sich nach rechts und links bewegen, bis es mit der rechten oder linken Wand kollidiert.
    if (rightArrow && paddle.x + paddle.w < game.width) {
        paddle.x += paddle.speed;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

// Ball Bewegung
const moveBall = () => {
    ball.x += ball.vx;
    ball.y += ball.vy;
}

// Kollisionserkennung Wand
const wallCollision = () => {
    // Wenn der Ball mit der linken oder rechten Wand kollidiert, wird der vx-Wert negiert.
    if ((ball.x + ball.radius > game.width) ||
        (ball.x - ball.radius < 0))
        ball.vx *= -1;
    // Wenn der Ball mit der Decke kollidiert, wird der vy-Wert negiert.
    if (ball.y - ball.radius < 0)
        ball.vy *= -1;
    // Wenn der Ball mit dem Boden kollidiert, verliert der Spieler ein Leben, Schläger und Ball werden zurückgesetzt.
    if (ball.y + ball.radius > game.height - marginBottom) {
        lives--;
        resetPaddle();
        resetBall();
    }
}

// Kollisionserkennung Schläger
const paddleCollision = () => {
    // Prüfen, wo der Ball auftrifft.
    let collisionPoint = ball.x - (paddle.x + paddle.w / 2); // Ballmitte - Schlägermitte
    collisionPoint /= (paddle.w / 2); // Normierung -> Ergibt Werte zwischen -1 und 1
    let reboundAngle = collisionPoint * (Math.PI / 3); // Abprall-Winkel = Kollisionspunkt * 60° 

    // Wenn der Ball mit dem Schläger kollidiert, ergibt die Geschwindigkeit * dem Sinus vom Abprall-Winkel den neuen vx-Wert
    // und die negierte Geschwindigkeit * dem Cosinus vom Abprall-Winkel den neuen vy-Wert.
    // Die Ball-Geschwindigkeit wird leicht erhöht.
    if (ball.y + ball.radius > paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w
    ) {
        ball.vx = ball.speed * Math.sin(reboundAngle);
        ball.vy = -ball.speed * Math.cos(reboundAngle);
        ball.speed += 0.1;
    } 
}

// Kollisionserkennung Stein
const brickCollision = () => {
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            if (bricks[r][c].status) {
                // Wenn der Ball mit dem Stein kollidiert, wird der vy-Wert negiert, die Ball-Geschwindigkeit erhöht sich,
                // der Stein verschwindet, Punkte werden zugezählt.
                if (ball.x + ball.radius > bricks[r][c].x &&
                    ball.x - ball.radius < bricks[r][c].x + brick.w &&
                    ball.y + ball.radius > bricks[r][c].y &&
                    ball.y - ball.radius < bricks[r][c].y + brick.h) {
                    ball.vy *= -1;
                    ball.speed += 0.05;
                    bricks[r][c].status = false;
                    score += pointsPerBrick[r];
                }
            }
        }
    }
}

// Schläger zurücksetzen
const resetPaddle = () => {
    paddle.x = (game.width - paddle.w) / 2;
    paddle.y = game.height - paddle.h - marginBottom;
}

// Ball zurücksetzen
const resetBall = () => {
    ball.x = game.width / 2;
    ball.y = paddle.y - ballRadius;
    ball.vx = 4 * (Math.random() * 2 - 1);
    ball.vy = -4;
    ball.speed = 5;
}

// High Score speichern (POST Request an Server)
const postHighScore = () => {
    fetch('/highscore', {
        method: 'POST',
        headers: {'content-type': 'application/json',},
        body: JSON.stringify({score})
    // Erhaltene Daten werden in JSON konvertiert.
    }).then(res => res.json()
    // Daten werden ausgegeben.
    ).then(data => {
        console.log(data);
        highScore = data.highScore
    }).catch(err =>
        console.error('Error:', err)
    );
}

// High Score laden (GET Request an Server)
const getHighScore = () => {
    fetch('/highscore').then(
        // Erhaltene Daten werden in JSON konvertiert.
        res => res.json()
        // Daten werden ausgegeben.
    ).then(data => {
        console.log(data);
        highScore = data.highScore
    }).catch(err =>
        console.error('Error:', err)
    );
}

// Levelaufstieg/Spiel gewonnen
const levelUp = () => {
    // Ein Level wurde geschafft, wenn alle sichtbaren Steine zerstört wurden.
    levelComplete = true;
    for (let r = 0; r < brick.rows; r++) {
        for (let c = 0; c < brick.cols; c++) {
            levelComplete = levelComplete && !bricks[r][c].status
        }
    }
    // Wenn ein Level geschafft wurde, steigt der Spieler ins nächste Level auf, eine weitere Steinreihe kommt hinzu,
    // Paddle und Ball werden zurückgesetzt.
    if (levelComplete) {
        brick.rows++;
        createBricks();
        resetPaddle();
        resetBall();
        level++;
    }
    // Wenn alle Level geschafft wurden, erscheint das Winner Pop-up.
    if (level >= 6) {
        gameOver = true;
        document.getElementById('winner').classList.remove('hidepopup');
        document.getElementById('resultwinner').textContent = `Du hast ${score} Punkte erreicht.`;

        // Bei Klick auf "Nochmal spielen" verschwindet das Winner Pop-up und das Spiel wird neu geladen.
        const newGame = document.querySelector("#newgame");
        newGame.addEventListener('click', function () {
            document.getElementById('winner').classList.add('hidepopup');
            document.location.reload();
        });
        postHighScore();
    }
}

// Spiel veloren
const gameLost = () => {
    // Wenn alle Leben verbraucht sind, erscheint das Loser Pop-up.
    if (!lives) {
        gameOver = true;
        document.getElementById('loser').classList.remove('hidepopup');
        document.getElementById('resultloser').textContent = `Du hast immerhin ${score} Punkte erreicht.`;

        // Bei Klick auf "Nochmal versuchen" verschwindet das Winner Pop-up und das Spiel wird neu geladen.
        const newChance = document.querySelector("#newchance");
        newChance.addEventListener('click', function () {
            document.getElementById('loser').classList.add('hidepopup');
            document.location.reload();
        });
        postHighScore();
    }
}

// Alle Updates
const update = () => {
    movePaddle();
    moveBall();
    wallCollision();
    paddleCollision();
    brickCollision();
    levelUp();
    gameLost();
}

// Alle Zeichnungen
const draw = () => {
    drawGameBG();
    drawBricks();
    drawPaddle();
    drawBall();
    drawGameStats(scoreIcon, 24, game.height - 66, score, 80, game.height - 28);
    drawGameStats(livesIcon, 233, game.height - 66, lives, 289, game.height - 28);
    drawGameStats(levelIcon, 441, game.height - 66, level, 497, game.height - 28);
    drawGameStats(highScoreIcon, 650, game.height - 66, highScore, 706, game.height - 28);
}

// Spielschleife
const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height);
    draw();
    update();
    // Solange das Spiel noch nicht vorbei ist, wird die Spielschleife vor jedem erneuten Rendern des Browserfensters aufgerufen (effizienter als Zeitintervalle).
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// High Score laden, Steine erstellen, Spielschleife starten
const init = () => {
    getHighScore();
    createBricks();
    gameLoop();
}


// INIT

init();
