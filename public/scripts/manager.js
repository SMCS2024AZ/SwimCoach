$(document).ready(function() {
  var swimmerTable = $("#swimmerTable").DataTable({
    info: false,
    lengthChange: false,
    ordering: false,
    pageLength: 8,
    columnDefs: [
      {
        target: 3,
        visible: false
      }
    ],
    initComplete: function() {
      var api = this.api();
      $("#swimmerTable").show();
      api.columns.adjust();
    }
  });

  $(".dataTables_filter").css("display", "none");

  $(document).on("click", ".dropdown-item", function() {
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);

    var group = $(".active.group").text();
    group = (group == "All age groups") ? "" : group;
    var gender = $(".active.gender").text();
    gender = (gender == "All genders") ? "" : "^" + gender + "$";
    swimmerTable.column(1).search(gender, true, false, true).column(3).search(group).draw();
  });

  $("#searchbar").on("input", function() {
    swimmerTable.column(0).search($(this).val()).draw();
  });

  $(document).on("click", ".del", function() {
    var check = confirm("Are you sure you would like to delete this swimmer?");
    var currRow = $(this).closest("tr");
    if (check) {
      $.ajax({
        url: "/teammanager/del",
        type: "DELETE",
        data: JSON.stringify({
          id: parseInt($(this).closest("td").prevAll("input").val())
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
          swimmerTable.row(currRow).remove().draw();
        }
      });
    }
  });

  $(document).on("click", ".edit", function() {
    console.log("here");
  });

  $("#add").click(function() {
    alert("todo");
  });
});
