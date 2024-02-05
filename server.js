const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const notesData = require('./db/db.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    // Logging request to terminal
    console.info(`${req.method} request received to get notes`);

    // Send all notes to the client
    return res.status(200).json(notesData);
});

// TODO: A /api/notes GET endpoint that returns notes as a json
// TODO: A /api/notes POST endpoint that adds a note from a json

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
