// The API object contains methods for each kind of request we'll make
var API = {
  create: function (newComp) {
    return $.ajax({
      type: "POST",
      url: "api/competition/create",
      data: newComp
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
  console.log("ID: " + competitionId);
  if (competitionId) {
    API.getInfo(competitionId, function (competition) {
      console.log("competiton: " + competition)
    });
  }
});
