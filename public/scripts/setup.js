$(document).ready(function() {
  // change active dropdown
  $(".dropdown-item").click(function() {
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type.replace(" normal", "")).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);
  });

  // update checklist based on age group
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
        if (data.length == 0) {
          $(".checklist").append(`<div class="form-check pt-1"><label class="form-check-label text-muted" disabled><input class="form-check-input" type="checkbox" disabled\>No swimmers</label></div>`);
        } else {
          for (const swimmer of data) {
            var check = `<div class="form-check pt-1"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="swimmer" value="${swimmer.name},${swimmer.id}"\>${swimmer.name}</label></div>`;
            $(".checklist").append(check);
          }
        }
      }
    });
  });

  // make sure times are correct for each race type
  $(".stroke").click(function() {
    if ($(this).text() == "Individual Medley") {
      $(".normal").removeClass("active").addClass("disabled");
      $(".im").removeClass("disabled").addClass("active");
    } else {
      $(".normal").removeClass("disabled");
      $("#default").addClass("active");
      $(".im").removeClass("active").addClass("disabled");
    }
  });

  // send race type and swimmers to server
  $(".start").click(function() {
    var race = $(".stroke.active").text() + $(".distance.active").text();
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
  });
});
