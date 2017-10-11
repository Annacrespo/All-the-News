var cheerio = require("cheerio");
var request = require("request");

request("https://www.nytimes.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.story-heading").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text().trim();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).parent().find("ul > li").html();

    // var itemHtml = $(element).html();
    // console.log(itemHtml);
    if (i===0) {
        console.log(result.summary);
    }
    })
});