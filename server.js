'use strict';

// SERVER AUFBAU

const opn = require('better-opn');
const express = require('express');
const server = express();


// MIDDLEWARE

server.use(express.static('public'));
server.use(express.json());


// VARIABLEN

let highScore = 0;


// ROUTEN

// Der vom Client angeforderte High Score wird zurückgegeben
server.get('/highscore', (req, res) => {
    res.send(JSON.stringify({highScore}));
})

// Falls die vom Client gesendete Punktzahl höher ist als der High Score, wird er aktualisiert
server.post('/highscore', (req, res) => {
    if (req.body.score > highScore) {
        highScore = req.body.score;
    }
    console.log(highScore);
    res.send(JSON.stringify({
        status: 'ok',
        highScore
    }))
});


// SERVER STARTEN

// Server lauscht auf Verbindungen auf Port 3000
server.listen(3000, err => {
    if (err) console.log('Error:', err);
    else console.log('Server läuft');
    opn('http://localhost:3000');
});