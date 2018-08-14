// The API object contains methods for each kind of request we'll make
var API = {
  addUser: function (competitionId, username) {
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

  addEntry: function (competitionId, userId, value, date) {
    if (!competitionId) { return undefined }
    if (!userId) { return undefined }
    if (!value) { return undefined }
    if (!date) { return undefined }
    return $.ajax({
      type: "POST",
      url: "api/competition/addEntry",
      data: {
        competitionId: competitionId,
        userId: userId,
        value: value,
        date: date
      }
    });
  },

  getInfo: function (competitionId, cb) {
    if (!competitionId) { return undefined }
    return $.get("/api/competition/" + competitionId, function (data) {
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
  if (competitionId) {
    API.getInfo(competitionId, function (competition) {
      addChartToDivWithData($("#competition-container"), competition);
    });
  }

  $("#competitions-btn").on('click', function () {
    window.location.href = "/user/competitions";
  });

  $("#add-btn").on('click', function () {
    var username = $("#username-field").val();
    var competitionId = localStorage.getItem("competitionId");
    if (!username || username.length == 0 || !competitionId) { return; }

    API.addUser(competitionId, username).done(function () {
      window.location.href = window.location.href;
    }).fail(function (error) {
      var error = JSON.parse(error.responseText).error;
      if (error) {
        alert(error);
      }
    });
  });


  $("#add-value-btn").on('click', function () {
    var value = $("#value-field").val();
    var competitionId = localStorage.getItem("competitionId");
    var userId = localStorage.getItem("userId");
    if (!userId || !value || !competitionId) { return; }
    

    var date = moment().startOf('day').toDate()
    API.addEntry(competitionId, userId, value, date).done(function () {
      window.location.href = window.location.href;
    }).fail(function (error) {
      var error = JSON.parse(error.responseText).error;
      if (error) {
        alert(error);
      }
    });
  });
});
