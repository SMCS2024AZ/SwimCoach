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
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: function(data) {
        $(".checklist").empty();
        for (const swimmer of data) {
          var check = `<div class=\"form-check pt-1\"><label class=\"form-check-label\"><input class=\"form-check-input\" type=\"checkbox\" name=\"swimmer\" value=\"${swimmer.name}\">${swimmer.name}</label></div>`;
          $(".checklist").append(check);
        }
        // TODO: Build checklist based on data received
      }
    });
  });

  $(".start").click(function() {
    // group and race
    var group = $(".group.active").text();
    var race = $(".race.active").text();
    alert("Group: " + group + "\nRace: " + race);
    // swimmers
    $("input[name=\"swimmer\"]:checked").each(function() {
      alert($(this).val());
    });
  })
});
