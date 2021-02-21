require('dotenv')
const connectionString = `postgres://${process.env.USER}:7mtG@CuswWtR@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=./cc-ca.crt&options=--cluster=nifty-bear-808`
const Pool = require('pg').Pool

const pool = new Pool({
  connectionString
})

// test function to get the notes
const getAllNotes = (request, response) => {
  pool.query('SELECT * FROM "note"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getNotesByTag = (req, res) => {
  const tagArray = req.body.tags;
  // want format of tagArray coming in to be
  // 'Physics', 'Chemistry', ...
  pool.query(`SELECT note.* FROM tagmap, note, tag WHERE tagmap.tag_id = tag.id AND (tag.tagname IN (${tagArray})) AND note.id = tagmap.note_id GROUP BY note.id ORDER BY upvotes DESC`, 
    (err, results) => {
      if (err) {
        console.log(err)
        res.json(err)
      }
      console.log(results.rows)
      res.status(200).json(results.rows)
    })
}

// text column "'Physics', 'Chemistry'"

// Used for getting a specific Note and to return that note's tags in json format
// do this using a query within the query. First query gets the note and the second gets the tags of that note
const getNotesByTitle = (req, res) => {
  const title = req.body.title;
  let payload = {}
  pool.query(`SELECT * FROM note WHERE note.title='${title}'`)
    .then((results) => {
      payload.note = results.rows;
      pool.query(`SELECT tag.tagname
      FROM tagmap, note, tag
      WHERE tagmap.tag_id = tag.id
      AND note.id = ${results.rows[0].id}
      AND note.id = tagmap.note_id;`)
      .then((results) => {
        payload.tags = results.rows;
        console.log(results.rows)
        res.json(payload)
      })
    })
}

module.exports = {
  getAllNotes,
  getNotesByTag,
  getNotesByTitle
}


