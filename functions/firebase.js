const admin = require("firebase-admin");
const serviceAccount = require(
    "./sdhacks2021-6261c-firebase-adminsdk-y8w4v-dea35caf7e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sdhacks2021-6261c.appspot.com",
});

const bucket = admin.storage().bucket();

/* Download function for testing
*/
async function downloadFileTest(req, res) {
  // get files return an array of files
  await bucket.getFiles()
      .then((file) => {
        // BEEG not secure, fix this later
        // Like no joke not secure
        file[0][0].makePublic();
        console.log(file[0][0].publicUrl());
        res.json(file[0][0].publicUrl());
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
}

/* INPUT: file name in the parameter of the url
OUTPUT: url for that object*/
async function getFile(req, res) {
  // create a reference to a file in our bucket
  // using the request parameters
  const file = bucket.file(`${req.params.filename}`);

  // config was needed for the getSignedUrl function. It defines what it does
  const config = {
    action: "read",
    expires: "2-27-2021",
  };

  // getSignedUrl returns a promise, so use await
  await file.getSignedUrl(config)
      .then((url) => {
        console.log(url);
        res.json(url);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
}

/* const uploadFile = (req, res) => {
  // the front end will give me a file path/file
  // physics_hw
  // +
  // user_name (for now)
  // ^^^ Biiiiiiig security risk

  const options = {
    destination: `dummy_thicc`,
    resumable: true,
    validation: 'crc32c',
    metadata: {
      metadata: {
        event: 'Fall trip to the zoo'
      }
    }
  };

  // assuming client gives us the file path
  bucket.upload(`${req.body.filepath}`, options)
    .then(() => {
      console.log("Uploaded Succesfully")
      res.json("Uploaded Successfully")
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
}*/

module.exports = {
  downloadFileTest,
  getFile,
  // uploadFile,
};
