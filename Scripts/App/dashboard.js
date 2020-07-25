$(document).ready(function () {
   var  data1 = {
        datasets: [{
            data: [10, 20, 30]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    };

    //var myDoughnutChart1 = new Chart("chartContainer1", {
    //    type: 'doughnut',
    //    data: data1,
    //    //options: options
    //});


    //var ctx = $("#chartContainer1");
    //var myDoughnutChart = new Chart(ctx, {
    //    type: 'bar',
    //    data: {
    //        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //        datasets: [{
    //            label: '# of Votes',
    //            data: [12, 19, 3, 5, 2, 3],
    //            backgroundColor: [
    //                'rgba(255, 99, 132, 0.2)',
    //                'rgba(54, 162, 235, 0.2)',
    //                'rgba(255, 206, 86, 0.2)',
    //                'rgba(75, 192, 192, 0.2)',
    //                'rgba(153, 102, 255, 0.2)',
    //                'rgba(255, 159, 64, 0.2)'
    //            ],
    //            borderColor: [
    //                'rgba(255, 99, 132, 1)',
    //                'rgba(54, 162, 235, 1)',
    //                'rgba(255, 206, 86, 1)',
    //                'rgba(75, 192, 192, 1)',
    //                'rgba(153, 102, 255, 1)',
    //                'rgba(255, 159, 64, 1)'
    //            ],
    //            borderWidth: 1
    //        }]
    //    },
    //    options: {
    //        scales: {
    //            yAxes: [{
    //                ticks: {
    //                    beginAtZero: true
    //                }
    //            }]
    //        }
    //    }
    //});
    //myDoughnutChart.render();

    var chartDiv = $("#ACCSchartContainer");
    var Days015 = 21;

    var daysOld = [];
    daysOld.push(21);
    daysOld.push(50);
    daysOld.push(10);
    daysOld.push(1);

    //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
    var myChart = new Chart(chartDiv, {
        type: 'pie',
        data: {
            labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
            datasets: [
                {
                    data: daysOld, //[Days015, 39, 10,  1],
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED"
                    ]
                }]
        },
        options: {
            title: {
                display: true,
                text: 'DDOL'
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            maintainAspectRatio: false,
        }
    });
    
    var chartDiv = $("#DDOLchartContainer");
    var Days015 = 21;
    var daysOld = [];
    daysOld.push(10);
    daysOld.push(20);
    daysOld.push(30);
    daysOld.push(50);

    //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
    var myChart = new Chart(chartDiv, {
        type: 'pie',
        data: {
            labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
            datasets: [
                {
                    data: daysOld, //[Days015, 39, 10,  1],
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED"
                    ]
                }]
        },
        options: {
            title: {
                display: true,
                text: 'ACCS'
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            maintainAspectRatio: false,
        }
    });


    var ACCHchartDiv = $("#ACCHchartContainer");
    var Days015 = 21;
    var daysOld = [];
    daysOld.push(50);
    daysOld.push(30);
    daysOld.push(20);
    daysOld.push(10);
    //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
    var ACCHChart = new Chart(ACCHchartDiv, {
        type: 'pie',
        data: {
            labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
            datasets: [
                {
                    data: daysOld, //[Days015, 39, 10,  1],
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED"
                    ]
                }]
        },
        options: {
            title: {
                display: true,
                text: 'ACCH'
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            maintainAspectRatio: false,
        }
    });


});