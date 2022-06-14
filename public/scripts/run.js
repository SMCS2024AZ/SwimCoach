const start = Date.now();
var results = [];

$(document).ready(function() {
  // update stopwatches
  var interval = setInterval(function() {
    $(".timer.enabled").each(function() {
      var elapsed = Date.now() - $(this).attr("value");
      $(this).text((elapsed / 1000).toFixed(2));
    });
  }, 10);

  $(".start").click(function() {
    var timeElem = $(this).closest("td").prev();
    timeElem.attr("class", "align-middle timer enabled");
    timeElem.attr("value", Date.now());
    $(this).next().prop("disabled", false);
    $(this).prop("disabled", true);
    $(".startAll").prop("disabled", true);
    $(".reset").attr("class", "btn btn-primary reset");
    $(".reset").prop("disabled", false);
  });

  $(".startAll").click(function() {
    $(".timer").each(function() {
      $(this).attr("class", "align-middle timer enabled");
      $(this).attr("value", Date.now());
      $(".start").each(function() {
        $(this).prop("disabled", true);
      });
    });
    $(".startAll").prop("disabled", true);
    $(".reset").attr("class", "btn btn-primary reset");
    $(".reset").prop("disabled", false);
  });

  $(".reset").click(function() {
    $(".timer").each(function() {
      $(this).attr("class", "align-middle timer disabled");
      $(this).text("0.00");
    });

    $(".start").each(function() {
      $(this).prop("disabled", false);
    });
    $(".done").attr("class", "btn btn-secondary done");
    $(".done").prop("disabled", true);
    $(".startAll").attr("class", "btn btn-primary startAll");
    $(".startAll").prop("disabled", false);

    $(".stop").each(function() {
      $(this).prop("disabled", true);
    });
  });

  // handle stopping
  $(".stop").click(function() {
    var timeElem = $(this).closest("td").prev();
    timeElem.attr("class", "align-middle timer stopped");
    results.push({
      id: timeElem.closest("td").prevAll("input").val(),
      time: timeElem.text()
    });
    $(this).prop("disabled", true);

    // enabled done button if all watches are stopped
    if ($(".stopped").length == $(".timer").length) {
      $(".done").attr("class", "btn btn-primary done");
      $(".done").prop("disabled", false);
    }
  });

  // send results
  $(".done").click(function() {
    $.ajax({
      url: "/stopwatch/run",
      type: "POST",
      data: JSON.stringify({
        results: results,
        race: $(".race").val().replace(" ", "").toLowerCase(),
        timestamp: moment().format()
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        window.location.replace("/");
      }
    });
  });
});
