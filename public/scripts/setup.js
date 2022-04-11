$(document).ready(function() {
  $(".dropdown-item").click(function() {
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);
  });

  $(".group").click(function() {
    $.ajax({
      url: "/setup",
      type: "POST",
      data: JSON.stringify({
        func: "chooseGroup",
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
      }
    });
  });

  $(".start").click(function() {
    var group = $(".group.active").text();
    var race = $(".race.active").text();
    var swimmers = [];
    $("input[name=\"swimmer\"]:checked").each(function() {
      swimmers.push($(this).val());
    });
    $.ajax({
      url: "/stopwatch",
      type: "POST",
      data: JSON.stringify({
        func: "start",
        group: group,
        race: race,
        swimmers: swimmers
      }),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8'
    }).done(res => {
      console.log(res);
      var body = res.match(/<body>(.*)<\/body>/)[1];
      $("body").html(body);
    });
  })
});
