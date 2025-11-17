// Profession Management JavaScript
$(document).ready(function () {
  // Initialize DataTable or any other initialization
  initializeProfessionManagement();
});

function initializeProfessionManagement() {
  // Handle add button click
  $("#addProfessionBtn").on("click", function () {
    openProfessionModal();
  });

  // Handle edit button clicks
  $(document).on("click", ".edit-profession-btn", function () {
    const professionId = $(this).data("id");
    const professionName = $(this).data("name");
    const professionDescription = $(this).data("description") || "";
    const professionStatus = $(this).data("status");
    const professionIcon = $(this).data("icon") || null;
    openProfessionModal(professionId, professionName, professionDescription, professionStatus, professionIcon);
  });

  // Handle form submission
  $("#professionForm").on("submit", function (e) {
    e.preventDefault();
    submitProfessionForm();
  });

  // Handle delete button clicks
  $(document).on("click", ".delete-profession-btn", function () {
    const professionId = $(this).data("id");
    const professionName = $(this).data("name");
    confirmDeleteProfession(professionId, professionName);
  });

  // Handle delete confirmation
  $("#confirmDeleteProfession").on("click", function () {
    const professionId = $(this).data("profession-id");
    deleteProfession(professionId);
  });

  // Handle cancel buttons
  $(document).on("click", "#professionModal .modal-close", function () {
    closeProfessionModal();
  });

  $(document).on("click", "#deleteProfessionModal .modal-close", function () {
    $("#deleteProfessionModal").addClass("hidden");
  });
}

function openProfessionModal(
  professionId = null,
  professionName = "",
  professionDescription = "",
  professionStatus = true,
  professionIcon = null
) {
  // Reset form
  $("#professionForm")[0].reset();
  $("#professionForm").find(".error-message").remove();
  $("#professionForm").find(".border-red-500").removeClass("border-red-500");
  $("#iconPreview").addClass("hidden");
  $("#iconPreviewImg").attr("src", "");

  if (professionId) {
    // Edit mode
    $("#professionModalTitle").text("Edit Profession");
    $("#professionId").val(professionId);
    $("#professionName").val(professionName);
    $("#professionDescription").val(professionDescription);
    $("#professionStatus").val(professionStatus ? "true" : "false");
    $("#professionSubmitBtn").text("Update");
    
    // Show existing icon if available
    if (professionIcon) {
      $("#iconPreview").removeClass("hidden");
      $("#iconPreviewImg").attr("src", professionIcon);
    }
  } else {
    // Add mode
    $("#professionModalTitle").text("Add Profession");
    $("#professionId").val("");
    $("#professionStatus").val("true");
    $("#professionSubmitBtn").text("Submit");
  }

  // Show modal
  $("#professionModal").removeClass("hidden");
}

// Handle icon preview
$(document).on("change", "#professionIcon", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      $("#iconPreview").removeClass("hidden");
      $("#iconPreviewImg").attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    $("#iconPreview").addClass("hidden");
    $("#iconPreviewImg").attr("src", "");
  }
});

function closeProfessionModal() {
  $("#professionModal").addClass("hidden");
  $("#professionForm")[0].reset();
  $("#professionForm").find(".error-message").remove();
  $("#professionForm").find(".border-red-500").removeClass("border-red-500");
}

function submitProfessionForm() {
  const formData = new FormData();
  formData.append("id", $("#professionId").val());
  formData.append("name", $("#professionName").val());
  formData.append("description", $("#professionDescription").val());
  formData.append("status", $("#professionStatus").val());
  
  // Append icon file if selected
  const iconFile = $("#professionIcon")[0].files[0];
  if (iconFile) {
    formData.append("icon", iconFile);
  }

  // Clear previous errors
  $("#professionForm").find(".error-message").remove();
  $("#professionForm").find(".border-red-500").removeClass("border-red-500");

  // Show loading state
  $("#professionSubmitBtn").prop("disabled", true).text("Saving...");

  $.ajax({
    url: "/save-profession",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      // Success - close modal first
      closeProfessionModal();
      
      // Show success notification
      if (response && response.message) {
        showNotification(response.message, "success");
      } else {
        showNotification("Profession saved successfully!", "success");
      }
      
      // Reload page after a short delay to show notification
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    error: function (xhr) {
      // Handle validation errors
      if (xhr.status === 422) {
        const errors = xhr.responseJSON.errors || [];
        displayValidationErrors(errors);
      } else {
        const errorMessage =
          xhr.responseJSON?.message ||
          "An error occurred while saving the profession.";
        showNotification(errorMessage, "error");
      }
    },
    complete: function () {
      // Reset button state
      $("#professionSubmitBtn").prop("disabled", false);
      const professionId = $("#professionId").val();
      if (professionId) {
        $("#professionSubmitBtn").text("Update");
      } else {
        $("#professionSubmitBtn").text("Submit");
      }
    },
  });
}

function displayValidationErrors(errors) {
  errors.forEach(function (error) {
    const fieldName = error.path || error.field;
    const errorMessage = error.msg || error.message;

    // Add error class to field
    $(
      `#profession${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).addClass("border-red-500");

    // Add error message
    const errorDiv = $(
      `<div class="error-message text-red-500 text-xs mt-1">${errorMessage}</div>`
    );
    $(
      `#profession${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).after(errorDiv);
  });
}

function confirmDeleteProfession(professionId, professionName) {
  $("#deleteProfessionName").text(professionName);
  $("#confirmDeleteProfession").data("profession-id", professionId);
  $("#deleteProfessionModal").removeClass("hidden");
}

function deleteProfession(professionId) {
  const $deleteBtn = $("#confirmDeleteProfession");
  const $btnText = $deleteBtn.find(".delete-btn-text");
  const $btnLoader = $deleteBtn.find(".delete-btn-loader");
  
  // Prevent multiple clicks
  if ($deleteBtn.prop("disabled")) return;
  
  // Set loading state
  $deleteBtn.prop("disabled", true).addClass("opacity-50 cursor-not-allowed");
  $btnText.addClass("hidden");
  $btnLoader.removeClass("hidden");
  
  $.ajax({
    url: `/delete-profession/${professionId}`,
    type: "POST",
    success: function (response) {
      if (response.status) {
        showNotification(response.message, "success");
        $("#deleteProfessionModal").addClass("hidden");
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        showNotification(response.message || "Error deleting profession", "error");
        // Reset loading state on error
        $deleteBtn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
        $btnText.removeClass("hidden");
        $btnLoader.addClass("hidden");
      }
    },
    error: function (xhr) {
      const errorMessage =
        xhr.responseJSON?.message ||
        "An error occurred while deleting the profession.";
      showNotification(errorMessage, "error");
      // Reset loading state on error
      $deleteBtn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
      $btnText.removeClass("hidden");
      $btnLoader.addClass("hidden");
    },
  });
}

// Close modals when clicking outside or on close buttons
$(document).on("click", ".modal-backdrop", function () {
  closeProfessionModal();
  $("#deleteProfessionModal").addClass("hidden");
});

// Close profession modal specifically
$(document).on("click", "#professionModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  closeProfessionModal();
});

// Close delete modal specifically
$(document).on("click", "#deleteProfessionModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $("#deleteProfessionModal").addClass("hidden");
});

// Prevent modal from closing when clicking inside modal content
$(document).on("click", ".modal-content", function (e) {
  e.stopPropagation();
});

// Additional handlers for cancel buttons
$(document).on(
  "click",
  "#professionModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeProfessionModal();
  }
);

$(document).on(
  "click",
  "#deleteProfessionModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#deleteProfessionModal").addClass("hidden");
  }
);

// Notification function using Toastify (if available) or custom notification
function showNotification(message, type = "info") {
  // Check if Toastify is available
  if (typeof Toastify !== "undefined") {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor:
        type === "success"
          ? "#28a745"
          : type === "error"
          ? "#dc3545"
          : "#17a2b8",
    }).showToast();
  } else {
    // Fallback to custom notification
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

