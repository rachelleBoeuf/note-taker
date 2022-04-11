const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const uuid = require('uuid');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})



app.get('/api/notes', (req, res) => {
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) return res.status(404).json(err);
        const notes = JSON.parse(data) || [];
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const note = {
            title,
            text,
            id: uuid.v4()
        };
        fs.readFile('db/db.json', "utf8", function (err, data) {
            if (err) return res.status(404).json(err);
            const savedNotes = JSON.parse(data) || [];
            savedNotes.push(note);
            fs.writeFile(`db/db.json`, JSON.stringify(savedNotes, null, 2), (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        'new note saved to JSON'
                    )
            );
        })
        const response = {
            status: 'success',
            body: note,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Post notes error');
    }
});









app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);





// fs.readFile('./db/db.json', 'utf8', function (err, data){
//     const SaveNotesToDBJSON = JSON.parse(data).push(notes)
// });
