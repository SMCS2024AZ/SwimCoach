$(document).ready(function() {
  // Canvas.js code
  var options = {
    animationEnabled: true,
    theme: "light2",
    axisX: {
      intervalType: "day",
      interval: 1,
      valueFormatString: "DD MMM YYYY"
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
      color: "#F08080",
      yValueFormatString: "#,##0s",
      dataPoints: [
        { x: new Date(2022, 4, 19), y: 30 },
      ]
    },
    {
      type: "line",
      showInLegend: true,
      name: "Freestyle 50m",
      yValueFormatString: "#,##0s",
      dataPoints: [
        { x: new Date(2022, 4, 19), y: 60 },
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
    });
  });

  $(".swimmer").click(function() {
    console.log("swimmer name")
  });
});
