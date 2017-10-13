
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + data[i].summary + "</p>");
    }
  });

  // Whenever someone clicks a p tag
  $("#articlesButton").on("click", function () {
    // Empty the notes from the note section
    // $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function (data) {
        console.log(data);
        // The title of the article
        $("#articles").append("<h2>" + data.title + "</h2>");
        $("#articles").append("<p>" + data.summary + "</p>");
        $("#articles").append("<p>" + data.link + "</p>");

        // An input to enter a new title
        // $("#articles").append("<input id='titleinput' name='title' >");
        // // A textarea to add a new note body
        // $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
        // // A button to submit a new note, with the id of the article saved to it
        // $("#articles").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // // If there's a note in the article
        // if (data.note) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);
        // }
      });
  });
