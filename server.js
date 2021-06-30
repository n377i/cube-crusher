'use strict';

const express = require('express');

const server = express();

server.use(express.static('public'));
server.use(express.json());

let highScore = 0;

server.get('/highscore', (req, res) => {
    res.send(JSON.stringify({highScore}));
})

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

server.listen(3000, err => {
    if (err) console.log(err);
    else console.log('Server läuft');
});