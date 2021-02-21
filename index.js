const express = require('express')
const bodyParser = require('body-parser')
const db = require('./functions/queries')
const firebase = require('./functions/firebase')
const functions = require('firebase-functions')
const app = express()
const port = 5000

// Server stuff
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Google Cloud routes
app.get('/api/files/testing', firebase.downloadFileTest)
app.get('/api/files/get/:filename', firebase.getFile)
// app.post('/api/files/upload', firebase.uploadFile)

// Cockroach DB routes
app.get('/api/notes/debug', db.getAllNotes)
app.get('/api/notes/tags', db.getNotesByTag)
app.get('/api/notes/title', db.getNotesByTitle)


// Start the listening/server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

exports.app = functions.https.onRequest(app);
