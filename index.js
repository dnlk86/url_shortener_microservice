require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const dns = require("dns");
// const url = require("url");
var mongoose = require("mongoose");

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

// mongo db connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// dns options
const options = { all: true };

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", function(req, res) {
  // check if valid url
  let myUrl = new URL(req.body.url);
  // console.log(myUrl.host);
  dns.lookup(myUrl.host, options, (err, addresses) => {
    if (err) {
      // if not valid throw error
      console.log(err);
    } else {
      console.log(addresses);
      // if valid check if already exist in db
      // if not insert new value
      // return newly inserted val in in json
    };
  });
});

app.get("/api/shorturl/:url?", function(req, res) {
  // if param is valid retrieve extended url from db
  // else throw error
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
