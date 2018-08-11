$(document).ready(function() {
  /* global moment */
  
  // blogContainer holds all of our competitions
  var competitionContainer = $(".competition-container");
  var competitionCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleCompetitionDelete);
  $(document).on("click", "button.edit", handleCompetitionEdit);
  // Variable to hold our competitions
  var competitions;
  
  // The code below handles the case where we want to get competitions for a specific user
  // Looks for a query param in the url for user_id
  var url = window.location.search;
  var userId;
  if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
    getCompetitions(userId);
  }
  // If there's no userId we just get all competitions as usual
  else {
    getCompetitions();
  }
  
  
  // This function grabs posts from the database and updates the view
  function getCompetitions(user) {
    userId = user || "";
    if (userId) {
      userId = "/?user_id=" + userId;
    }
    $.get("/api/competitions" + userId, function(data) {
      console.log("Competitions", data);
      competitions = data;
      if (!competitions || !competitions.length) {
        displayEmpty(user);
      }
      else {
        initializeRows();
      }
    });
  }
  
  // This function does an API call to delete competitions
  function deleteCompetition(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/competitions/" + id
    })
      .then(function() {
        getCompetitions(competitionCategorySelect.val());
      });
  }
  
  // InitializeRows handles appending all of our constructed competition HTML inside competitionContainer
  function initializeRows() {
    competitionContainer.empty();
    var competitionsToAdd = [];
    for (var i = 0; i < competitions.length; i++) {
      competitionsToAdd.push(createNewRow(competitions[i]));
    }
    competitionContainer.append(competitionsToAdd);
  }
  
  // This function constructs a post's HTML
  function createNewRow(competition) {
    var formattedDate = new Date(competition.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newCompetitionCard = $("<div>");
    newCompetitionCard.addClass("card");
    var newCompetitionCardHeading = $("<div>");
    newCompetitionCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newCompetitionTitle = $("<h2>");
    var newCompetitionDate = $("<small>");
    var newCompetitionUser = $("<h5>");
    newCompetitionUser.text("Created by: " + competition.User.name);
    newCompetitionUser.css({
      float: "right",
      color: "blue",
      "margin-top":
        "-10px"
    });
    var newCompetitionCardBody = $("<div>");
    newCompetitionCardBody.addClass("card-body");
    var newCompetitionBody = $("<p>");
    newCompetitionTitle.text(competition.title + " ");
    newCompetitionBody.text(competition.body);
    newCompetitionDate.text(formattedDate);
    newCompetitionTitle.append(newCompetitionDate);
    newCompetitionCardHeading.append(deleteBtn);
    newCompetitionCardHeading.append(editBtn);
    newCompetitionCardHeading.append(newCompetitionTitle);
    newCompetitionCardHeading.append(newCompetitionUser);
    newCompetitionCardBody.append(newCompetitionBody);
    newCompetitionCard.append(newCompetitionCardHeading);
    newCompetitionCard.append(newCompetitionCardBody);
    newCompetitionCard.data("competition", competition);
    return newCompetitonCard;
  }
  
  // This function figures out which competition we want to delete and then calls deleteCompetition
  function handleCompetitionDelete() {
    var currentCompetition = $(this)
      .parent()
      .parent()
      .data("competition");
    deleteCompetition(currentCompetition.id);
  }
  
  // This function figures out which competition we want to edit and takes it to the appropriate url
  function handleCompetitionEdit() {
    var currentCompetition = $(this)
      .parent()
      .parent()
      .data("competition");
    window.location.href = "/ccf?competition_id=" + currentCompetition.id;
  }
  
  // This function displays a message when there are no competitions
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for User #" + id;
    }
    competitionContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No posts yet" + partial + ", navigate <a href='/ccf" + query +
      "'>here</a> in order to get started.");
    competitionContainer.append(messageH2);
  }
  
});
  