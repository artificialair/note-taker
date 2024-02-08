const express = require('express');
const path = require('path');
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT ?? 3001;

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
    fs.readFile(`./db/db.json`, (err, data) => {
        if (err) console.error(err);
        return res.status(200).json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    // Logging request to terminal
    console.info(`${req.method} request received to add a note`);
    // Prepare response object
    let response;

    const { title, text } = req.body;
    // Return error responses if title or text are missing
    if (!title) {
        response = { success: false, reason: "Missing/Empty title" };
        return res.status(400).json(response);
    } else if (!text) {
        response = { success: false, reason: "Missing/Empty text" };
        return res.status(400).json(response);
    }

    // create new notes object
    const newNote = {
        id: uuid(),
        title,
        text
    }
    // Get existing notes from JSON file
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
  
    res.status(201).json(response);
});

app.delete('/api/notes/:id', (req, res) => {
    // Logging request to terminal
    console.info(`${req.method} request received to delete a note`);

    const idToDelete = req.params.id;
    fs.readFile(`./db/db.json`, (err, data) => {
        if (err) console.error(err);
        const parsedData = JSON.parse(data);
        // Iterate through notes and delete the first note that matches the requested ID
        for (const [index, note] of parsedData.entries()) {
            if (note.id === idToDelete) {
                parsedData.splice(index, 1);
                fs.writeFile(`./db/db.json`, JSON.stringify(parsedData), (err) => {
                    err
                      ? console.error(err)
                      : console.log(`Note ${idToDelete} has been deleted from JSON file`)
                });
                return res.status(204)
            }
        }
        // If a note was not deleted, return not found error
        return res.status(404).json({ success: false, reason: `Note ${req.params.id} not found.`})
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
