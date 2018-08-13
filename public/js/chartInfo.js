function addChartToDivWithData(div, competitionData) {
    var randomNumber = Math.floor((Math.random() * 256) - 1);

    function randomColorOne() {
        randomNumber1 = Math.floor((Math.random() * 256) - 1);
        randomNumber2 = Math.floor((Math.random() * 256) - 1);
        randomNumber3 = Math.floor((Math.random() * 256) - 1);
        var randomColor = "rgba(" + randomNumber1 + "," + randomNumber2 + "," + randomNumber3 + ")";
        return randomColor;
    }

    function randomColorTwo() {
        randomNumber1 = Math.floor((Math.random() * 256) - 1);
        randomNumber2 = Math.floor((Math.random() * 256) - 1);
        randomNumber3 = Math.floor((Math.random() * 256) - 1);
        var randomColor = "rgba(" + randomNumber1 + "," + randomNumber2 + "," + randomNumber3 + ")";
        return randomColor;
    }

    function randomWeight() {
        var weightArray = [];
        for (var i = 0; i < 7; i++) {
            var randomNumber = Math.floor((Math.random() * 256) - 1);
            weightArray.push(randomNumber);
        }
        return weightArray;
    }

    var participants = competitionData.participants;
    var competitors = [];

    for (var i = 0; i < participants.length; i++) {
        competitors.push(participants[i].username);
    }

    function userWeights() {
        var startTime = moment(competitionData.startTime);
        if (!startTime) { return }
        var userWeights = {};
        for (var i = 0; i < participants.length; i++) {
            var participant = participants[i];
            var username = participant.username;
            var weights = [];
            var entries = participant.entries;
            for (var j = 0; j < entries.length; j++) {
                var entry = entries[j];
                timeDiff = moment(entry.date).diff(startTime, 'd');
                var data = {
                    x: timeDiff,
                    y: entry.value
                }
                weights.push(entry.value);
            }
            userWeights[username] = weights;
        }

        return userWeights;
    }

    var labels = [];
    for (var i = 1; i <= 30; i++) {
        labels.push(i);
    }

    function uniqueUser(values, username) {
        return {
            data: values,
            label: username,
            backgroundColor: [
                randomColorOne()
            ],
            borderColor: [
                randomColorTwo()
            ],
            borderWidth: 1,
            borderDash: [5, 1],
            borderDashOffset: 0,
            borderCapStyle: "round",
            borderJoinStyle: "round",
            cubicInterpolationMode: "monotone",
            fill: false,
            lineTension: 1,
            pointBackgroundColor: [
                randomColorOne()
            ],
            pointBorderColor: [
                randomColorTwo()
            ],
            pointBorderWidth: 2,
            pointRadius: 5,
            pointStyle: "circle",
            PointHitRadius: 5,
            pointHoverBackgroundColor: [
                randomColorOne()
            ],
            pointHoverBorderColor: [
                randomColorTwo()
            ],
            pointHoverBorderWidth: 7,
            pointHoverRadius: 9,
            showLine: true,
            spanGaps: true,
            steppedLine: false
        };
    }

    function graphUsers() {
        var users = [];
        var weights = userWeights();
        for (var i = 0; i < competitors.length; i++) {
            var competitor = competitors[i];
            users.push(uniqueUser(weights[competitor], competitor));
        }
        return users;
    }


    var canvas = $('<canvas id="myChart" style="text-align: center; background-color: white">')
    div.append(canvas);

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: graphUsers()
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        }
    });

    return canvas;
}