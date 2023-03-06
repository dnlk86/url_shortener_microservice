const mongoose = require("mongoose");

let hortUrlSchema = mongoose.Schema({
  original_url: String,
  short_url: String
}, {collection: "short_urls"});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);