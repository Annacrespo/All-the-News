var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var path = require("path");

module.exports = function (app) {
  // Routes
  // ======
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });
  // A GET request to scrape the echojs website
  app.get("/scrape", function (req, res) {
    //First, we grab the body of the html with request
    request("https://www.nytimes.com/", function (error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article.story").each(function (i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).children("h2").text();
        result.link = $(element).children("h2").children("a").attr("href");
        result.summary = $(element).children("p.summary").text();
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title, link, and summary)
        var entry = new Article(result);
        if (result.title && result.link && result.summary) {
          // Now, save that entry to the db
          entry.save(function (err, doc) {
            // Log any errors
            if (err) {
              console.log(err);
            }
            // Or log the doc
            else {
              console.log(true);
            }
          });
        }

      });
    });
    // Tell the browser that we finished scraping the text
    res.json({"success": true});
  });
  // This will get the articles we scraped from the mongoDB
  app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });

  //update articles
  app.put("/articles", function(req, res){
    //get an article by it's id 
    //and update that articles saved 
    //column/row from false to true

    
    res.json("updated article");
  });

  app.get("/saved/articles", function(req, res){
    //get all of our saved articles 
    res.json("saved articles");
  });



  // Grab an article by it's ObjectId
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      // now, execute our query
      .exec(function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise, send the doc to the browser as a json object
        else {
          res.json(doc);
        }
      });
  });
  // Create a new note or replace an existing note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);
    // And save the new note the db
    newNote.save(function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's note
        Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
          // Execute the above query
          .exec(function (err, doc) {
            // Log any errors
            if (err) {
              console.log(err);
            }
            else {
              // Or send the document to the browser
              res.send(doc);
            }
          });
      }
    });
  });
}