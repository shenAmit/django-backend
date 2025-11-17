let quill; // Declare globally so it's accessible in jQuery

$(document).ready(function () {
  // Initialize Quill
  quill = new Quill("#quillEditor", {
    theme: "snow",
    modules: {
      toolbar: false, // you're using a custom toolbar
    },
  });

  // Send button click handler
  $("#sendBtn").on("click", function () {
    const title = $("#title").val();
    const message = quill.root.innerHTML;
    const role = $('input[name="role"]:checked').val() || "";

    // Validation
    if (!title || !message.trim() || role.length === 0) {
      $('#required_field').show()
      return;
    }

    // Send data using AJAX
    // Disable the send button before sending and change color
    $("#sendBtn").prop("disabled", true).css("background-color", "#cccccc");

    $.ajax({
      url: "/send-notification",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ title, message, role }),
      success: function (response) {
        if (response.status == true) {
          $('#success_msg').show();
           $('#success_msg span').text(response.message);
        } else {
           $('#required_field').show();
           $('#required_field span').text(response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error(error);
      },
      complete: function () {
        // Re-enable the send button after request completes and restore color
        $("#sendBtn").prop("disabled", false).css("background-color", "");
      },
    });
  });
});
