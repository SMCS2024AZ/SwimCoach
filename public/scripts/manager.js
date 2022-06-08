$(document).ready(function() {
  // datatable setup
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

  // search datatable
  function updateSelections() {
    var group = $(".active.group").text();
    group = (group == "All age groups") ? "" : group;
    var gender = $(".active.gender").text();
    gender = (gender == "All genders") ? "" : "^" + gender + "$";
    swimmerTable.column(1).search(gender, true, false, true).column(3).search(group).draw();
  }

  function updateSearch() {
    swimmerTable.column(0).search($("#searchbar").val()).draw();
  }

  $(document).on("click", ".dropdown-item", function() {
    var type = $(this).attr("class").replace("dropdown-item ", "");
    $(".active." + type).attr("class", "dropdown-item " + type);
    $(this).attr("class", "dropdown-item active " + type);

    updateSelections();
  });

  $("#searchbar").on("input", function() {
    updateSearch();
  });

  // deletion
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

  // edit users
  $(document).on("click", ".edit", function() {
    $(this).html("<span class=\"fa fa-check\"></span>").removeClass("edit").addClass("confirm");
    $(this).next().html("<span class=\"fa fa-times\"></span>").removeClass("del").addClass("cancel");

    var curr = $(this).closest("tr");
    curr.children("td").each(function(index) {
      if (index < 3) {
        var text = $(this).text();
        $(this).html(`<input type="hidden" value="${text}"><input type="text" class="form-control" value="${text}">`);
        $(this).children().eq(1).css("width", text.length * 8 + 48);
      }
    });
  });

  $(document).on("click", ".confirm", function() {
    $(this).html("<span class=\"fa fa-edit\"></span>").removeClass("confirm").addClass("edit");
    $(this).next().html("<span class=\"fa fa-trash\"></span>").removeClass("cancel").addClass("del");
    var curr = $(this).closest("tr");

    $.ajax({
      url: "/teammanager/edit",
      type: "POST",
      data: JSON.stringify({
        name: $(this).closest("td").prevAll().eq(2).children().eq(1).val(),
        gender: $(this).closest("td").prevAll().eq(1).children().eq(1).val(),
        age: parseInt($(this).closest("td").prevAll().eq(0).children().eq(1).val()),
        id: parseInt($(this).closest("td").prevAll("input").val())
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
          curr.children("td").each(function(index) {
          if (index < 3) {
            var content = $(this).first().children("input").eq(1).val();
            $(this).html(content);
            $(this).css("width", "auto");
            swimmerTable.cell(this).data(content);
            updateSelections();
            updateSearch();
          }
        });
      }
    });
  });

  $(document).on("click", ".cancel", function() {
    $(this).html("<span class=\"fa fa-trash\"></span>").removeClass("cancel").addClass("del");
    $(this).prev().html("<span class=\"fa fa-edit\"></span>").removeClass("confirm").addClass("edit");

    var curr = $(this).closest("tr");
    curr.children("td").each(function(index) {
      if (index < 3) {
        $(this).html($(this).first().children("input").val())
        $(this).css("width", "auto");
      }
    });
  });

  // add new
  $("#add").click(function() {
    alert("todo");
  });
});
