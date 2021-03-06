/* Showing Mongoose's "Populated" Method
 * =============================================== */
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
var filePath = path.join(__dirname,"./routes/routes" );

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Initialize Express
var app = express();

require("./routes/routes.js")(app);
// app.use("/", routes);
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// Make public a static dir
app.use(express.static("public"));

var databaseUri = 'mongodb://localhost/test';

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
  } else {
    mongoose.connect(databaseUri);
  }
// Database configuration with mongoose
// mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;
// // Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(5000, function() {
  console.log("App running on port 5000!");
});