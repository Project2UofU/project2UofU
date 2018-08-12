var API = {
    // This function grabs posts from the database and updates the view
    getCompetitions: function (userId, cb) {
        if (!userId) { return undefined }
        return $.get("/api/user/competitions?userId=" + userId, function (data) {
            var competitions = data.competitions ? data.competitions : [];
            cb(competitions);
        });
    }
}


$(document).ready(function () {
    var userId = localStorage.getItem("userId");
    if (!userId) {
        console.log("Missing userId");
        return
    }

    API.getCompetitions(userId, function (competitions) {
        displayCompetitions(competitions)
    });

    function displayCompetitions(competitions) {
        var container = $("#competitions-container");
        for (i = 0; i < competitions.length; i++) {
            var competition = competitions[i];
            container.append(divForCompetition(competition, i < competitions.length - 1));
        }
    }

    function divForCompetition(competition, addPadding) {
        var div = $("<div class='z-depth-1' id='competition'>");
        div.data("title", competition.title);
        div.data("id", competition.id);
        if (addPadding) {
            div.css("margin-bottom", "15px");
        }

        div.append($("<div>").text("Name: " + competition.title));
        div.append($("<div>").text("Participants: " + competition.participantCount));

        $(div).on('click', function () {
            localStorage.setItem("competitionId", $(this).data("id"));
            localStorage.setItem("competitionTitle", $(this).data("title"));
            window.location.href = "/competition";
        });
        $(div).hover(
            function () {
                $(this).css("background-color", "#FFFF0011");
            }, function () {
                $(this).css("background-color", "");
            }
        );
        return div;
    }

});