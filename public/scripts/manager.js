$(document).ready(function() {
  $(document).on("click", ".dropdown-item", function(){
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);

    $.ajax({
      url: "/teammanager/group",
      type: "GET",
      data: {
        group: $(".active.group").text().toLowerCase(),
        gender: $(".active.gender").text().toLowerCase()
      },
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        $("tbody").empty();
        if (data.length == 0) {
          $("tbody").append("<tr><td class=\"align-middle\" colspan=\"4\">No swimmers found</td></tr>");
        } else {
          data.forEach(function(swimmer) {
            $("tbody").append(`<tr>
              <input type="hidden" class="swimmerID" value="${swimmer.id}">
              <td class="align-middle">${swimmer.name}</td>
              <td class="align-middle">${swimmer.gender.charAt(0).toUpperCase() + swimmer.gender.slice(1)}</td>
              <td class="align-middle">${swimmer.age}</td></tr>`)
          });
        }
      }
    });
  });

  $("#searchbar").on("input", function() {
    $.ajax({
      url: "/teammanager/search",
      type: "GET",
      data: {
        term: $(this).val()
      },
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        $("tbody").empty();
        if (data.length == 0) {
          $("tbody").append("<tr><td class=\"align-middle\" colspan=\"4\">No swimmers found</td></tr>");
        } else {
          data.forEach(function(swimmer) {
            $("tbody").append(`<tr>
              <input type="hidden" class="swimmerID" value="${swimmer.id}">
              <td class="align-middle">${swimmer.name}</td>
              <td class="align-middle">${swimmer.gender.charAt(0).toUpperCase() + swimmer.gender.slice(1)}</td>
              <td class="align-middle">${swimmer.age}</td></tr>`)
          });
        }
      }
    });
  });

  $("#add").click(function() {
    alert("todo");
  });
});
