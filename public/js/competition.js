// The API object contains methods for each kind of request we'll make
var API = {
  addUser: function (competitionId, username, cb) {
    if (!competitionId) { return undefined }
    if (!username) { return undefined }
    return $.ajax({
      type: "POST",
      url: "api/competition/addParticipant",
      data: {
        competitionId: competitionId,
        username: username
      }
    });
  },

  getInfo: function (competitionId, cb) {
    if (!competitionId) { return undefined }
    return $.get("/api/competition/" + competitionId, function (data) {
      console.log("Competition: ", JSON.stringify(data));
      var competition = data.competition;
      cb(competition);
    });
  }

}

$(document).ready(function () {
  var competitionId = localStorage.getItem("competitionId");
  var competitionName = localStorage.getItem("competitionTitle");
  if (competitionName) {
    $("#competition-name").text(competitionName);
  }
  console.log("ID: " + competitionId);
  if (competitionId) {
    API.getInfo(competitionId, function (competition) {
      console.log("competiton: " + competition)
      addChartToDivWithData($("#competition-container"), competition);
    });
  }

  $("#add-btn").on('click', function () {
    var username = $("#username-field").val();
    console.log(username);
    var competitionId = localStorage.getItem("competitionId");
    if (!username || username.length == 0 || !competitionId) { return; }

    API.addUser(competitionId, username).done(function () {
      window.location.href = window.location.href;
    }).fail(function () {
      alert("Failed to add participant");
    });
  });
});
