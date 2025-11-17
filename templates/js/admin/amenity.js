// Amenity Management JavaScript
$(document).ready(function () {
  // Initialize DataTable or any other initialization
  initializeAmenityManagement();
});

function initializeAmenityManagement() {
  // Handle add button click
  $("#addAmenityBtn").on("click", function () {
    openAmenityModal();
  });

  // Handle edit button clicks
  $(document).on("click", ".edit-amenity-btn", function () {
    const amenityId = $(this).data("id");
    const amenityName = $(this).data("name");
    const amenityStatus = $(this).data("status");
    const amenityIcon = $(this).data("icon") || null;
    openAmenityModal(amenityId, amenityName, amenityStatus, amenityIcon);
  });

  // Handle form submission
  $("#amenityForm").on("submit", function (e) {
    e.preventDefault();
    submitAmenityForm();
  });

  // Handle delete button clicks
  $(document).on("click", ".delete-amenity-btn", function () {
    const amenityId = $(this).data("id");
    const amenityName = $(this).data("name");
    confirmDeleteAmenity(amenityId, amenityName);
  });

  // Handle delete confirmation
  $("#confirmDeleteAmenity").on("click", function () {
    const amenityId = $(this).data("amenity-id");
    deleteAmenity(amenityId);
  });

  // Handle cancel buttons
  $(document).on("click", "#amenityModal .modal-close", function () {
    closeAmenityModal();
  });

  $(document).on("click", "#deleteAmenityModal .modal-close", function () {
    $("#deleteAmenityModal").addClass("hidden");
  });
}

function openAmenityModal(
  amenityId = null,
  amenityName = "",
  amenityStatus = true,
  amenityIcon = null
) {
  // Reset form
  $("#amenityForm")[0].reset();
  $("#amenityForm").find(".error-message").remove();
  $("#amenityForm").find(".border-red-500").removeClass("border-red-500");
  $("#iconPreview").addClass("hidden");
  $("#iconPreviewImg").attr("src", "");

  if (amenityId) {
    // Edit mode
    $("#amenityModalTitle").text("Edit Amenity");
    $("#amenityId").val(amenityId);
    $("#amenityName").val(amenityName);
    $("#amenityStatus").val(amenityStatus ? "true" : "false");
    $("#amenitySubmitBtn").text("Update");
    
    // Show existing icon if available
    if (amenityIcon) {
      $("#iconPreview").removeClass("hidden");
      $("#iconPreviewImg").attr("src", amenityIcon);
    }
  } else {
    // Add mode
    $("#amenityModalTitle").text("Add Amenity");
    $("#amenityId").val("");
    $("#amenityStatus").val("true");
    $("#amenitySubmitBtn").text("Submit");
  }

  // Show modal
  $("#amenityModal").removeClass("hidden");
}

// Handle icon preview
$(document).on("change", "#amenityIcon", function () {
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

function closeAmenityModal() {
  $("#amenityModal").addClass("hidden");
  $("#amenityForm")[0].reset();
  $("#amenityForm").find(".error-message").remove();
  $("#amenityForm").find(".border-red-500").removeClass("border-red-500");
}

function submitAmenityForm() {
  const formData = new FormData();
  formData.append("id", $("#amenityId").val());
  formData.append("name", $("#amenityName").val());
  formData.append("status", $("#amenityStatus").val());
  
  // Append icon file if selected
  const iconFile = $("#amenityIcon")[0].files[0];
  if (iconFile) {
    formData.append("icon", iconFile);
  }

  // Clear previous errors
  $("#amenityForm").find(".error-message").remove();
  $("#amenityForm").find(".border-red-500").removeClass("border-red-500");

  // Show loading state
  $("#amenitySubmitBtn").prop("disabled", true).text("Saving...");

  $.ajax({
    url: "/save-amenity",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      // Success - close modal first
      closeAmenityModal();
      
      // Show success notification
      if (response && response.message) {
        showNotification(response.message, "success");
      } else {
        showNotification("Amenity saved successfully!", "success");
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
          "An error occurred while saving the amenity.";
        showNotification(errorMessage, "error");
      }
    },
    complete: function () {
      // Reset button state
      $("#amenitySubmitBtn").prop("disabled", false);
      const amenityId = $("#amenityId").val();
      if (amenityId) {
        $("#amenitySubmitBtn").text("Update");
      } else {
        $("#amenitySubmitBtn").text("Submit");
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
      `#amenity${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).addClass("border-red-500");

    // Add error message
    const errorDiv = $(
      `<div class="error-message text-red-500 text-xs mt-1">${errorMessage}</div>`
    );
    $(
      `#amenity${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).after(errorDiv);
  });
}

function confirmDeleteAmenity(amenityId, amenityName) {
  $("#deleteAmenityName").text(amenityName);
  $("#confirmDeleteAmenity").data("amenity-id", amenityId);
  $("#deleteAmenityModal").removeClass("hidden");
}

function deleteAmenity(amenityId) {
  const $deleteBtn = $("#confirmDeleteAmenity");
  const $btnText = $deleteBtn.find(".delete-btn-text");
  const $btnLoader = $deleteBtn.find(".delete-btn-loader");
  
  // Prevent multiple clicks
  if ($deleteBtn.prop("disabled")) return;
  
  // Set loading state
  $deleteBtn.prop("disabled", true).addClass("opacity-50 cursor-not-allowed");
  $btnText.addClass("hidden");
  $btnLoader.removeClass("hidden");
  
  $.ajax({
    url: `/delete-amenity/${amenityId}`,
    type: "POST",
    success: function (response) {
      // Success - reload page or remove row
      location.reload();
    },
    error: function (xhr) {
      alert("An error occurred while deleting the amenity.");
      // Reset loading state on error
      $deleteBtn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
      $btnText.removeClass("hidden");
      $btnLoader.addClass("hidden");
    },
  });
}

// Close modals when clicking outside or on close buttons
$(document).on("click", ".modal-backdrop", function () {
  closeAmenityModal();
  $("#deleteAmenityModal").addClass("hidden");
});

// Close amenity modal specifically
$(document).on("click", "#amenityModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  closeAmenityModal();
});

// Close delete modal specifically
$(document).on("click", "#deleteAmenityModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $("#deleteAmenityModal").addClass("hidden");
});

// Prevent modal from closing when clicking inside modal content
$(document).on("click", ".modal-content", function (e) {
  e.stopPropagation();
});

// Additional handlers for cancel buttons
$(document).on(
  "click",
  "#amenityModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeAmenityModal();
  }
);

$(document).on(
  "click",
  "#deleteAmenityModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#deleteAmenityModal").addClass("hidden");
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

