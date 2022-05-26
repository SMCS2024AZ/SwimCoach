function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

$(document).ready(function() {
  // { x: parseISOString("2022-04-13 18:38:13-04"), y: 30 }

  // Chart.js code

  // UI implementation
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
          $(".swimmers").append("<li><a class=\"dropdown-item disabled\">No swimmers</a></li>");
        } else {
          data.forEach(function(swimmer, i) {
            var check;
            check = `<li><a class="dropdown-item group swimmer" value="${swimmer.name},${swimmer.id}">${swimmer.name}</a></li>`;
            $(".swimmers").append(check);
          });
        }
      }
    });
  });
});
