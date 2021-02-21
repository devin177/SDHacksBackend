require("dotenv");
const connectionString = `postgres://${process.env.USER}:7mtG@CuswWtR@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=./cc-ca.crt&options=--cluster=nifty-bear-808`;
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString,
});

// test function to get the notes
const getAllNotes = (request, response) => {
  pool.query("SELECT * FROM note", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getNotesByTag = (req, res) => {
  const tagArray = req.body.tags;
  // want format of tagArray coming in to be
  // 'Physics', 'Chemistry', ...
  pool.query(`SELECT note.*
    FROM tagmap, note, tag 
    WHERE tagmap.tag_id = tag.id 
    AND (tag.tagname IN (${tagArray})) 
    AND note.id = tagmap.note_id 
    GROUP BY note.id 
    ORDER BY upvotes DESC`,
  (err, results) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    console.log(results.rows);
    res.status(200).json(results.rows);
  });
};

// text column "'Physics', 'Chemistry'"

// Used for getting a specific Note and to return that note's tags in json
// format
// Do this using a query within the query. First query gets the note and
// the second gets the tags of that note

const getNotesByTitle = (req, res) => {
  const title = req.body.title;
  const payload = {};
  pool.query(`SELECT * FROM note WHERE note.title="${title}"`)
      .then((results) => {
        payload.note = results.rows;
        pool.query(`SELECT tag.tagname
      FROM tagmap, note, tag
      WHERE tagmap.tag_id = tag.id
      AND note.id = ${results.rows[0].id}
      AND note.id = tagmap.note_id;`)
            .then((results) => {
              payload.tags = results.rows;
              console.log(results.rows);
              res.json(payload);
            });
      });
};

  // This will be putting stuff into the cockroachDB tables.
  // body of request will contain the stuff I want
  // assume it has a title, upvote: 0, content: name of the file
  // 1 create for the note
  // for every tag in the array
    // Check if it exists
      // else create a new tag
    // Create a mapping to a NOte
  // also an array or tags
const createNote = (req, res) => {
  const payload = req.body;
  // query into cockroachDB
  pool.query(`INSERT INTO note (title, upvotes, filename) VALUES (${payload.title}, 0, ${payload.filename})`)
      .then((results) => {
        console.log(`Successfully created new note ${payload.title}`);
        res.json(`Successfully created new note ${payload.title}`);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      })
};

// 'Cooking'
// only column is tagname
const createTag = (req, res) => {
  const payload = req.body;
  pool.query(`INSERT INTO tag (tagname) VALUES (${payload.tagname})`)
      .then((results) => {
        const message = `Successfully created new tag ${payload.tagname}`;
        console.log(message);
        res.json(message);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      })
};

// We are assuming that we are given the correct id's of note and tag
const createMapping = (req, res) => {
  const payload = req.body;
  // this picture thing is taking a while so ill just code without talking
  pool.query(`INSERT INTO tagmap (note_id, tag_id) VALUES (${payload.note_id}, ${payload.tag_id})`)
      .then((results) => {
        const message = `Successfully created new mapping between ${payload.note_id} and ${payload.tag_id}`
        console.log(message);
        res.json(message);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      })
};

// Upvote a certain note by id
const upvote = (req, res) => {
  pool.query(`UPDATE note SET upvotes = upvotes + 1 WHERE id = ${req.body.note_id}`)
      .then((results) => {
        const message = `ID#${req.body.note_id} has been upvoted`;
        console.log(message);
        res.json(message);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      })
}

// Downvote a certain note by id
const downvote = (req, res) => {
  pool.query(`UPDATE note SET upvotes = upvotes - 1 WHERE id = ${req.body.note_id} and upvotes > 0`)
      .then((results) => {
        const message = `ID#${req.body.note_id} has been downvoted`;
        console.log(message);
        res.json(message);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      })
}

module.exports = {
  getAllNotes,
  getNotesByTag,
  getNotesByTitle,
  createNote,
  createTag,
  createMapping,
  upvote,
  downvote,
};


