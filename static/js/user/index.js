$(document).on("click", '[data-modal-target="delete-user-modal"]', function () {
  const userId = $(this).data("user-id");
  $("#delete-user-id").val(userId);
});

//delete user
$("#confirm-delete-user").on("click", function () {
  const userId = $("#delete-user-id").val();
  if (!userId) return;

  $.ajax({
    url: `/user-delete/${userId}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (res) {
      $("#delete-user-modal").addClass("hidden");

      $(`[data-user-id="${userId}"]`).closest("tr").remove();

      window.location.reload();
    },
    error: function (err) {
      console.error(err);
      alert("Error deleting user.");
    },
  });
});

