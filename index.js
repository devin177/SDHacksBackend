const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/notes', db.getAllNotes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



