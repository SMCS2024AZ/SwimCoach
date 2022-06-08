$(document).ready(function() {
  $(document).on("click", ".dropdown-item", function(){
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);
  });

  $(".swimmerAdd").submit(function() {
    $.ajax({
      url: "/teammanager/add",
      type: "POST",
      data: JSON.stringify({
        name: $("#swimmerName").val(),
        gender: $(".active.gender").text(),
        age: parseInt($("#swimmerAge").val())
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        alert($("#swimmerName").val() + " successfully added!");
      }
    });
  });
});
