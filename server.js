const express = require('express');
const path = require('path');
const PORT = 3001;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// TODO: A /api/notes GET endpoint that returns notes as a json
// TODO: A /api/notes POST endpoint that adds a note from a json

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
