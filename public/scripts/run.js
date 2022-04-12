const start = Date.now();
var results = [];

$(document).ready(function() {
  // update stopwatches
  var interval = setInterval(function() {
    var elapsed = Date.now() - start;
    $(".timer").each(function() {
      $(this).text((elapsed / 1000).toFixed(2));
    });
  }, 10);

  // handle stopping
  $(".stop").click(function() {
    var timeElem = $(this).closest("td").prev();
    timeElem.attr("class", "align-middle stopped");
    results.push({
      id: timeElem.closest("td").prev().prev().val(),
      time: timeElem.text()
    })
    $(this).prop("disabled", true);

    // enabled done button if all watches are stopped
    if ($(".timer").length == 0) {
      $(".done").attr("class", "btn btn-primary done");
      $(".done").prop("disabled", false);
    }
  });

  // TODO: upload to database
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
