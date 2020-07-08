const express = require("express");
const path = require("path");
let database = require("./db/db.json");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3100;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Send notes to html path
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    database = JSON.parse(data);
    res.json(database);
  });
});

app.post("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    database = JSON.parse(data);
    var newNote = req.body;
    database.push(newNote);
    database.forEach((obj, i) => (obj.id = ++i));
    console.log(database);
    fs.writeFile("./db/db.json", JSON.stringify(database), "utf8", (err) => {
      if (err) throw err;
      res.json(database);
    });
  });
});

// Deletes note from database
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    const arrayOfNotes = JSON.parse(data);
    const notDeleted = arrayOfNotes.filter(function (note) {
      return note.id != req.params.id;
    });
    fs.writeFile("./db/db.json", JSON.stringify(notDeleted), "utf8", (err) => {
      if (err) throw err;
      res.json(notDeleted);
    });
  });
});

// Sends to homepage
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Listens to the port
app.listen(PORT, function () {
  console.log("App listening on http://localhost:" + PORT);
});