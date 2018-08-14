$(document).ready(function() {
  // Getting jQuery references to the competition body, title, form, and user select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var createCompForm = $("#ccf");
  var userSelect = $("#user");
  // Adding an event listener for when the form is submitted
  $(createCompForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a competition)
  var url = window.location.search;
  var competitionId;
  var userId;
  // Sets a flag for whether or not we're updating a competition to be false initially
  var updating = false;
  
  // If we have this section in our url, we pull out the competition id from the url
  // In '?competition_id=1', competitionId is 1
  if (url.indexOf("?competition_id=") !== -1) {
    competitionId = url.split("=")[1];
    getCompetitionData(competitionId, "post");
  }
  // Otherwise if we have an user_id in our url, preset the user select box to be our User
  else if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
  }
  
  // Getting the users, and their competitions
  getUsers();
  
  // A function for handling what happens when the form to create a new competition is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the competition if we are missing a body, title, or user
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !userSelect.val()) {
      return;
    }
    // Constructing a newCompetition object to hand to the database
    var newCompetition = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
      UserId: userSelect.val()
    };
  
      // If we're updating a competition run updateCompetition to update a competition
      // Otherwise run submitCompetition to create a whole new competition
    if (updating) {
      newCompetition.id = competitionId;
      updateCompetition(newCompetition);
    }
    else {
      submitCompetition(newCompetition);
    }
  }
  
  // Submits a new competition and brings user to competitions page upon completion
  function submitCompetition(competition) {
    $.post("api/competitions", competition, function() {
      window.location.href = "competitions";
    });
  }
  
  // Gets competition data for the current competition if we're editing, or if we're adding to an user's existing competitions
  function getCompetitionData(id, type) {
    var queryUrl;
    switch (type) {
    case "competition":
      queryUrl = "api/competitions/" + id;
      break;
    case "user":
      queryUrl = "api/users/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.UserId || data.id);
        // If this competition exists, prefill our ccf forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        userId = data.UserId || data.id;
        // If we have a competition with this id, set a flag for us to know to update the competition
        // when we hit submit
        updating = true;
      }
    });
  }
  
  // A function to get Users and then render our list of Users
  function getUsers() {
    $.get("api/users", renderUserList);
  }
  // Function to either render a list of users, or if there are none, direct the user to the page
  // to create an user first
  function renderUserList(data) {
    if (!data.length) {
      window.location.href = "users";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createUserRow(data[i]));
    }
    userSelect.empty();
    console.log(rowsToAdd);
    console.log(userSelect);
    userSelect.append(rowsToAdd);
    userSelect.val(userId);
  }
  
  // Creates the user options in the dropdown
  function createUserRow(user) {
    var listOption = $("<option>");
    listOption.attr("value", user.id);
    listOption.text(user.name);
    return listOption;
  }
  
  // Update a given competition, bring user to the competitons page when done
  function updateCompetition(competition) {
    $.ajax({
      method: "PUT",
      url: "api/competitions",
      data: competition
    })
      .then(function() {
        window.location.href = "competitions";
      });
  }
});
  