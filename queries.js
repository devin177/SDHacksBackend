require('dotenv')
const connectionString = `postgres://${process.env.USER}:7mtG@CuswWtR@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=./cc-ca.crt&options=--cluster=nifty-bear-808`
const Pool = require('pg').Pool

const pool = new Pool({
  connectionString
})

// test function to get the notes
const getAllNotes = (request, response) => {
  pool.query('SELECT * FROM "Notes"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getAllNotes,
}


