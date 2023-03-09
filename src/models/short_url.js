const mongoose = require("mongoose");

let shortUrlSchema = mongoose.Schema({
  original_url: String,
  short_url: Number
}, {collection: "short_urls"});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);