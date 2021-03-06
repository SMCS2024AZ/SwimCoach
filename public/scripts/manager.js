$(document).ready(function() {
  // datatable setup
  var swimmerTable = $("#swimmerTable").DataTable({
    info: false,
    lengthChange: false,
    order: [[0, "asc"]],
    pageLength: 5,
    columnDefs: [
      {
        target: 3,
        visible: false
      },
      {
        targets: "_all",
        orderable: false
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

  $(document).on("click", ".swimmerGender", function() {
    $(".selectedGender").text($(".active.swimmerGender").text());
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
        if (index == 1) {
          $(this).html(
          `<div class="dropdown px-1">
            <button type="button" class="btn btn-primary dropdown-toggle selectedGender" data-bs-toggle="dropdown">
              ${text}
            </button>
            <input type="hidden" value="${text}">
            <ul class="dropdown-menu">
              <li><a class="dropdown-item swimmerGender">Male</a></li>
              <li><a class="dropdown-item swimmerGender">Female</a></li>
              <li><a class="dropdown-item swimmerGender">Other</a></li>
            </ul>
          </div>`);
          $(this).children().eq(0).children().eq(2).children().each(function(index) {
            if ($(this).text() == text.trim()) {
              $(this).children().eq(0).attr("class", "dropdown-item active swimmerGender");
            }
          });
        } else {
          $(this).html(`<input type="hidden" value="${text}"><input type="text" class="form-control" value="${text}">`);
          $(this).children().eq(1).css("width", text.length * 8 + 48);
        }
      }
    });
  });

  $(document).on("click", ".confirm", function() {
    var button = $(this);
    var curr = $(this).closest("tr");

    $.ajax({
      url: "/teammanager/edit",
      type: "POST",
      data: JSON.stringify({
        name: $(this).closest("td").prevAll().eq(2).children().eq(1).val(),
        gender: $(this).closest("td").prevAll().eq(1).children().eq(0).children().eq(0).text().trim(),
        age: parseInt($(this).closest("td").prevAll().eq(0).children().eq(1).val()),
        id: parseInt($(this).closest("td").prevAll("input").val())
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        if (data.errs != null) {
          $(".errors-container").css("display", "block");
          $(".errors").text(data.errs.join(" "));
        } else {
          curr.children("td").each(function(index) {
            if (index < 3) {
              var content = "";
              if (index == 1) {
                content = $(this).children().eq(0).children().eq(0).text();
              } else {
                content = $(this).first().children("input").eq(1).val();
              }
              $(this).html(content);
              $(this).css("width", "auto");
              swimmerTable.cell(this).data(content);
              updateSelections();
              updateSearch();
              button.html("<span class=\"fa fa-edit\"></span>").removeClass("confirm").addClass("edit");
              button.next().html("<span class=\"fa fa-trash\"></span>").removeClass("cancel").addClass("del");
              $(".errors-container").css("display", "none");
            }
          });
        }
      }
    });
  });

  $(document).on("click", ".cancel", function() {
    $(this).html("<span class=\"fa fa-trash\"></span>").removeClass("cancel").addClass("del");
    $(this).prev().html("<span class=\"fa fa-edit\"></span>").removeClass("confirm").addClass("edit");

    var curr = $(this).closest("tr");
    curr.children("td").each(function(index) {
      if (index < 3) {
        if (index == 1) {
          $(this).html($(this).children().eq(0).children().eq(1).val());
        } else {
          $(this).html($(this).first().children("input").val());
          $(this).css("width", "auto");
        }
      }
    });
  });
});
