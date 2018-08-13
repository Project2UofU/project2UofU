// The API object contains methods for each kind of request we'll make
var API = {
    create: function (newComp, cb) {
        return $.ajax({
            type: "POST",
            url: "api/competition/create",
            data: newComp
        });
    }
}

$(document).ready(function () {
    var nameField = $("#name-field");
    var cancelButton = $("#cancel-btn");
    var signupButton = $("#signup-btn");

    cancelButton.on('click', function () {
        window.location.href = "/user/competitions";
    });

    signupButton.on('click', function () {
        var userId = localStorage.getItem("userId");
        var title = nameField.val();
        if (!userId || !title || title.length == 0) {
            return;
        }

        var competitionParams = {
            title: title,
            ownerId: userId,
            startDate: moment().startOf('day').toDate()
        }

        API.create(competitionParams).done(function () {
            window.location.href = "/user/competitions";
        }).fail(function () {
            alert("Failed to create the competition");
        });
    });
});