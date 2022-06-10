function csvToArray(str) {
  var headers = ["name", "gender", "age"];
  var rows = str.slice(str.indexOf("\n") + 1).split("\n");
  var res = [];
  rows.forEach(function(row) {
    var data = row.split(",");
    var swimmer = {};
    data.forEach(function(item, index) {
      if (index == 1 && item == "") {
        swimmer[headers[index]] = "Other";
      } else if (index <= 2) {
        swimmer[headers[index]] = item.trim().replace("\r", "");
        if (headers[index] == "age") {
          swimmer["age"] = parseInt(swimmer["age"]);
        }
      }
    });
    res.push(swimmer);
  });
  return res;
}

$(document).ready(function() {
  // manage dropdowns
  $(document).on("click", ".dropdown-item", function(){
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);

    $(".selectedGender").text($(".active.gender").text());
  });

  // upload CSV
  $(".upload").on("change", function() {
    var filename = $(this).val().split("\\").pop();
    var shortened = filename.replace(new RegExp("(^[^\\.]{18})[^\\.]+"), "$1...");
    if (filename.slice(filename.length - 3) == "csv") {
      $(".filename").html(shortened);
      var file = this.files[0];
      var reader = new FileReader();
      reader.onload = function(evt) {
        var swimmers = csvToArray(evt.target.result);
        var text = "";
        swimmers.forEach(function(swimmer) {
          var row = [];
          Object.entries(swimmer).forEach(function(item) {
            row.push(item[1]);
          });
          text += row.join(",") + "\n";
        });
        $("#csvText").text(text);
      };
      reader.readAsText(file);
    } else {
        alert("Please upload a CSV file");
    }
  });

  // add individual
  $(".swimmerAdd").submit(function() {
    $.ajax({
      url: "/teammanager/individualAdd",
      type: "POST",
      data: JSON.stringify({
        name: $("#swimmerName").val(),
        gender: $(".active.gender").text(),
        age: parseInt($("#swimmerAge").val())
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        if (data.errs != null) {
          $(".messages-container").css("display", "block");
          $(".messages-container").css("color", "#d9534f");
          $(".messages").text(data.errs.join(" "));
        } else {
          $(".messages-container").css("display", "block");
          $(".messages-container").css("color", "#5cb85c");
          $(".messages").text("Successfully added " + $("#swimmerName").val() + ".");
        }
      }
    });
  });

  // add CSV
  $(".csvAdd").submit(function() {
    $.ajax({
      url: "/teammanager/csvAdd",
      type: "POST",
      data: JSON.stringify({
        swimmers: csvToArray($("#csvText").val().trim())
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        if (data.errs != null) {
          $(".csvMessages-container").css("display", "block");
          $(".csvMessages-container").css("color", "#d9534f");
          $(".csvMessages").text(data.errs.join(" "));
        } else {
          $(".csvMessages-container").css("display", "block");
          $(".csvMessages-container").css("color", "#5cb85c");
          $(".csvMessages").text("Swimmers successfully added.");
        }
      }
    });
  });
});
