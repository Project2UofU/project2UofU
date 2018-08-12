$(document).ready(function () {

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

    var newData = {
        "competition": {
            "title": "Weight Loss",
            "id": "6bfc90b6-baa1-4367-a36d-2f76fced7d87",
            "participants": [{
                    "username": "Michael",
                    "id": "194b797c-cdfd-46f5-a58f-3d04439d96ab",
                    "entries": [{
                            "date": "2018-08-11T18:49:00.000Z",
                            "value": 164
                        },
                        {
                            "date": "2018-08-12T18:49:00.000Z",
                            "value": 167
                        },
                        {
                            "date": "2018-08-13T18:49:00.000Z",
                            "value": 165
                        },
                        {
                            "date": "2018-08-14T18:49:00.000Z",
                            "value": 163
                        },
                        {
                            "date": "2018-08-15T18:49:00.000Z",
                            "value": 161
                        },
                        {
                            "date": "2018-08-16T18:49:00.000Z",
                            "value": 159
                        },
                        {
                            "date": "2018-08-17T18:49:00.000Z",
                            "value": 155
                        }
                    ]
                },
                {
                    "username": "Daniel",
                    "id": "9592c2fe-34ba-4b51-af75-d8a2d1531695",
                    "entries": [{
                            "date": "2018-08-11T18:49:00.000Z",
                            "value": 178
                        },
                        {
                            "date": "2018-08-12T18:49:00.000Z",
                            "value": 179
                        },
                        {
                            "date": "2018-08-13T18:49:00.000Z",
                            "value": 177
                        },
                        {
                            "date": "2018-08-14T18:49:00.000Z",
                            "value": 175
                        },
                        {
                            "date": "2018-08-15T18:49:00.000Z",
                            "value": 173
                        },
                        {
                            "date": "2018-08-16T18:49:00.000Z",
                            "value": 170
                        },
                        {
                            "date": "2018-08-17T18:49:00.000Z",
                            "value": 168
                        }
                    ]
                },
                {
                    "username": "Thomas",
                    "id": "b760ae27-e9ca-4b7f-a29e-c38c2bb9d31b",
                    "entries": [{
                            "date": "2018-08-11T18:49:00.000Z",
                            "value": 200
                        },
                        {
                            "date": "2018-08-12T18:49:00.000Z",
                            "value": 198
                        },
                        {
                            "date": "2018-08-13T18:49:00.000Z",
                            "value": 196
                        },
                        {
                            "date": "2018-08-14T18:49:00.000Z",
                            "value": 199
                        },
                        {
                            "date": "2018-08-15T18:49:00.000Z",
                            "value": 195
                        },
                        {
                            "date": "2018-08-16T18:49:00.000Z",
                            "value": 192
                        },
                        {
                            "date": "2018-08-17T18:49:00.000Z",
                            "value": 181
                        }
                    ]
                }
            ]
        }
    };
    var participants = newData.competition.participants;
    var competitors = [];

    function userLoop() {
        for (var i = 0; i < participants.length; i++) {
            competitors.push(participants[i].username);
        }
    }
    userLoop();

    // var weightsArray = [];  
    // function userWeight() {
    //     for (var i = 0; i < competitors.length; i++) {
    //         if (participants[i].username == competitors[i]) {
    //             for (var j = 0; j < participants[i].entries.length; j++) {

    //                 entries = participants[i].entries[j];
    //                 weightsArray.push(entries.value);
    //             }
    //         }
    //     }
    // }

    function userWeight() {
        var userWeights = {};
        for (var i = 0; i < participants.length; i++) {
            var participant = participants[i];
            var username = participant.username;
            var weights = [];
            var entries = participant.entries;
            for (var j = 0; j < entries.length; j++) {
                var entry = entries[j];
                weights.push(entry.value);
            }
            userWeights[username] = weights;
        }


        for (var k = 0; k < competitors.length; k++) {
            var user = competitors[k];
            var uniqueWeightArrays = userWeights[user];
        }
        return userWeights;
    }
    userWeight();
    // console.log(userWeight().Michael);


    var labels = [];

    function labelsArray() {
        for (var i = 1; i <= 7; i++) { //make the number a variable
            labels.push(i);
        }
    }
    labelsArray();

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

    // function graphUsers() {
    //     var users = [];
    //     for (var i = 0; i < competitors.length; i++) {
    //         var competitor = competitors[i];
    //         console.log("Competitor: " + competitor);
    //         console.log("Weights: " + userWeight().);
    //         users.push(uniqueUser(userWeight().competitor, competitor));
    //     }
    //     return users;
    // }
    function graphUsers() {
        userWeights();
        var users = [];
        var weights = userWeights();
        for (var i = 0; i < competitors.length; i++) {
            var competitor = competitors[i];
            console.log("Competitor: " + competitor);
            console.log("Weights: " + weights[competitor]);
            users.push(uniqueUser(weights[competitor], competitor));
        }
        return users;
    }


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
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});
