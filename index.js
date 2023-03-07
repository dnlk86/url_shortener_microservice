require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const dns = require("dns");
var mongoose = require("mongoose");

// mongo db connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`CONNECTED TO MONGO!`);
  })
  .catch((err) => {
    console.log(`OH NO! MONGO CONNECTION ERROR!`);
    console.log(err);
  });

let ShortUrl = require("./src/models/short_url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// dns options
const options = { all: true };

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", function(req, res) {
  let originalUrl = req.body.url;
  let myUrl = new URL(originalUrl);
  // check if valid url
  dns.lookup(myUrl.host, options, (err, addresses) => {
    if (err) {
      // if not valid throw error
      res.json({ error: 'invalid url' });
    } else {
      // if valid check if already exist in db
      ShortUrl.findOne({ "original_url": originalUrl }).then(retrievedUrl => {
        if (!retrievedUrl) {
          console.log("error: url not found");
          // find last inserted short_url
          // insert new value
          let record = new ShortUrl({
            original_url: originalUrl,
            short_url: 1
          });
          record.save().then((err, data) => {
            if (err) {
              console.log("err", err);
            } else {
              console.log("data", data);
            }
          });
        } else {
          console.log("retrievedUrl", retrievedUrl);
        }
      });
      // return newly inserted val in in json
    }
  });
});

app.get("/api/shorturl/:url?", function(req, res) {
  // if param is valid retrieve extended url from db
  // else throw error
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
