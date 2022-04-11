$(document).ready(function() {
  $(".dropdown-item").click(function() {
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);
  });

  $(".group").click(function() {
    $.ajax({
      url: "/stopwatch",
      type: "POST",
      data: JSON.stringify({
        group: $(this).text()
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        $(".checklist").empty();
        for (const swimmer of data) {
          var check = `<div class=\"form-check pt-1\"><label class=\"form-check-label\"><input class=\"form-check-input\" type=\"checkbox\" name=\"swimmer\" value=\"${swimmer.name},${swimmer.id}\">${swimmer.name}</label></div>`;
          $(".checklist").append(check);
        }
      }
    });
  });

  $(".start").click(function() {
    var group = $(".group.active").text();
    var race = $(".race.active").text();
    var swimmers = [];
    $("input[name=\"swimmer\"]:checked").each(function() {
      var values = $(this).val().split(",");
      swimmers.push({
        name: values[0],
        id: parseInt(values[1])
      });
    });
    $.ajax({
      url: "/stopwatch/run",
      type: "GET",
      data: {
        race: race,
        swimmers: swimmers
      },
      dataType: "text",
      success: function(data) {
        $("body").html(data);
      }
    });
  })
});