$(document).ready(function () {
    var randomNumber = Math.floor((Math.random() * 256) - 1);

    function randomColor() {
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

    function graphUser(values, username) {

        return {
            data: values,
            label: username,
            backgroundColor: [
                randomColor()
            ],
            borderColor: [
                randomColor()
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
                randomColor()
            ],
            pointBorderColor: [
                randomColor()
            ],
            pointBorderWidth: 2,
            pointRadius: 5,
            pointStyle: "circle",
            PointHitRadius: 5,
            pointHoverBackgroundColor: [
                randomColor()
            ],
            pointHoverBorderColor: [
                randomColor()
            ],
            pointHoverBorderWidth: 7,
            pointHoverRadius: 9,
            showLine: true,
            spanGaps: true,
            steppedLine: false
        };
    }



    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [7, 6, 5, 4, 3, 2, 1, 0],
            datasets: [graphUser(randomWeight(), "Steve"), graphUser(randomWeight(), "John")]
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