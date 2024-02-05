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

app.post('/api/notes', (req, res) => {
    // Logging request to terminal
    console.info(`${req.method} request received to add a note`);

    let response;
    const { title, text } = req.body;

    if (!title) {
        response = { success: false, reason: "Missing/Empty title" };
        return res.status(400).json(response);
    } else if (!text) {
        response = { success: false, reason: "Missing/Empty text" };
        return res.status(400).json(response);
    }

    const newNote = {
        title,
        text
    }
    
    fs.readFile(`./db/db.json`, (err, data) => {
        if (err) console.error(err);
        const parsedData = JSON.parse(data);
        parsedData.push(newNote)
        fs.writeFile(`./db/db.json`, JSON.stringify(parsedData), (err) => {
            err
              ? console.error(err)
              : console.log(`Note ${newNote.title} has been written to JSON file`)
        });
    });

    response = {
      success: true,
      body: newNote,
    };
  
    console.log(response);
    res.status(201).json(response);
});

// TODO: A /api/notes GET endpoint that returns notes as a json
// TODO: A /api/notes POST endpoint that adds a note from a json

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
