$(document).ready(function() {
  // Chart.js code
  var ctx = $("#myChart");

  var chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        plugins: {
            title: {
                display: true,
                text: 'No swimmer selected',
                font: {
                  size: 20
                }
            }
        }
      }
    });

  // UI implementation
  $(document).on("click", ".dropdown-item", function(){
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);
  });

  $(".group").click(function() {
    $.ajax({
      url: "/statviewer",
      type: "POST",
      data: JSON.stringify({
        id: 1,
        group: $(this).text()
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        $(".swimmers").empty();
        if (data.length == 0) {
          $(".swimmers").append("<li><a class=\"dropdown-item disabled\">No swimmers</a></li>");
        } else {
          data.forEach(function(swimmer, i) {
            var check = `<li><a class="dropdown-item swimmer" value="${swimmer.name},${swimmer.id}">${swimmer.name}</a></li>`;
            $(".swimmers").append(check);
          });
        }
      }
    });
  });

  $(document).on("click", ".swimmer", function() {
    $.ajax({
      url: "/statviewer",
      type: "POST",
      data: JSON.stringify({
        id: 2,
        swimmer: $(this).attr("value").split(",")
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        // setup category arrays
        var raceTypes = Object.entries(data).slice(5, 14);
        var timestampTypes = Object.entries(data).slice(14);

        // names and colors for each line
        var names = ["Freestyle 25", "Freestyle 50", "Backstroke 25", "Backstroke 50",
        "Breaststroke 25", "Breaststroke 50", "Butterfly 25", "Butterfly 50", "Individual Medley 100"]
        var colors = ["#ff6961", "#ffb480", "#f8f38d", "#42d6a4", "#08cad1", "#59adf6", "#9d94ff", "#c780e8", "#f8c8dc"];

        var dataset = [];

        // for every race category
        for (var i = 0; i < raceTypes.length; i++) {
          var results = raceTypes[i][1];
          var timestamps = timestampTypes[i][1];
          var buffer = [];
          if (results != null) {
            // for every result in current race category
            for (var j = 0; j < results.length; j++) {
              buffer.push({
                x: timestamps[j],
                y: results[j]
              });
            }
          }
          // add data to dataset
          var data = {
            label: names[i],
            data: buffer,
            borderColor: colors[i],
            fill: false,
            pointRadius: 8,
            hoverRadius: 7
          };
          dataset.push(data);
        }

        // update chart
        chart.data.datasets = dataset;
        chart.options = {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              }
            }
          },
          onClick(evt) {
            var points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            if (points.length > 0 && confirm("Are you sure?")) {
              var point = points[0];
              $.ajax({
                url: "/statviewer",
                type: "POST",
                data: JSON.stringify({
                  id: 3,
                  swimmerId: parseInt($(".active.swimmer").attr("value").split(",")[1]),
                  race: chart.data.datasets[point.datasetIndex].label.toLowerCase().replace(" ", ""),
                  index: point.index + 1
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                  chart.data.datasets[point.datasetIndex].data.splice(point.index, 1);
                  chart.update(data);
                }
              });
            }
          },
          plugins: {
            legends: {
              labels: {
                usePointStyle: true
              }
            }
          }
        };
	      chart.update();
      }
    });
  });
});
