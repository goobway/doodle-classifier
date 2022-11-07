const fs = require('fs');
const ndjson = require('ndjson');

// read large ndjson file as a stream (line by line)
let rainbows = [];
fs.createReadStream('rainbow.ndjson')
    .pipe(ndjson.parse())
    .on('data', function (obj) {
        rainbows.push(obj);
    })

let cats = [];
fs.createReadStream('cat.ndjson')
    .pipe(ndjson.parse())
    .on('data', function (obj) {
        //console.log(cat);
        cats.push(obj);
    })

const express = require('express');
const app = express();
const port = 3000;

// server is listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

app.get('/rainbow', (request, response) => {
    const index = Math.floor(Math.random() * rainbows.length);
    response.send(rainbows[index]);
});

app.get('/cat', (request, response) => {
    const index = Math.floor(Math.random() * cats.length);
    response.send(cats[index]);
});

app.use(express.static('public'))