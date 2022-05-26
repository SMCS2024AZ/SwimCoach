function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

$(document).ready(function() {
  // { x: parseISOString("2022-04-13 18:38:13-04"), y: 30 }

  // Canvas.js code
  var options = {
    animationEnabled: true,
    theme: "light2",
    axisX: {
      intervalType: "day",
      interval: 1,
      valueFormatString: "DD MMM YYYY",
    },
    axisY: {
      title: "Time",
      suffix: "s",
      minimum: 20
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "bottom",
      horizontalAlign: "left",
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries
    },
    data: [{
      type: "line",
      showInLegend: true,
      name: "Freestyle 25m",
      color: "#ff6961",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Freestyle 50m",
      color: "#ffb480",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Backstroke 25m",
      color: "#f8f38d",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Backstroke 50m",
      color: "#42d6a4",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Breaststroke 25m",
      color: "#08cad1",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Breaststroke 50m",
      color: "#59adf6",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Butterfly 25m",
      color: "#9d94ff",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Butterfly 50m",
      color: "#c780e8",
      yValueFormatString: "#,##0s",
      dataPoints: [
      ]
    }]
  };
  $("#chartContainer").CanvasJSChart(options);

  function toogleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  // UI js
  $(".dropdown-item").click(function() {
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);
    console.log("test");
  });

  $(".group").click(function() {
    $.ajax({
      url: "/statviewer",
      type: "POST",
      data: JSON.stringify({
        group: $(this).text()
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        // maybe add "no swimmers" message later with dropdown section header
        $(".swimmers").empty();
        if (data.length == 0) {
          $(".swimmers").append("<li><a class=\"dropdown-item disabled\"</a>No swimmers</li>");
        } else {
          data.forEach(function(swimmer, i) {
            var check;
            if (i == 0) {
              check = `<li><a class="dropdown-item group active swimmer" value="${swimmer.name},${swimmer.id}">${swimmer.name}</a></li>`;
            } else {
              check = `<li><a class="dropdown-item group swimmer" value="${swimmer.name},${swimmer.id}">${swimmer.name}</a></li>`;
            }
            $(".swimmers").append(check);
          });
        }
      }
    });
  });
});
