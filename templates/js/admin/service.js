// Service Management JavaScript
$(document).ready(function () {
  // Initialize Service Management
  initializeServiceManagement();
});

function initializeServiceManagement() {
  // Handle add button click
  $("#addServiceBtn").on("click", function () {
    openServiceModal();
  });

  // Handle edit button clicks
  $(document).on("click", ".edit-service-btn", function () {
    const serviceId = $(this).data("id");
    const serviceName = $(this).data("name");
    const serviceStatus = $(this).data("status");
    openServiceModal(serviceId, serviceName, serviceStatus);
  });

  // Handle form submission
  $("#serviceForm").on("submit", function (e) {
    e.preventDefault();
    submitServiceForm();
  });

  // Handle delete button clicks
  $(document).on("click", ".delete-service-btn", function () {
    const serviceId = $(this).data("id");
    const serviceName = $(this).data("name");
    confirmDeleteService(serviceId, serviceName);
  });

  // Handle delete confirmation
  $("#confirmDeleteService").on("click", function () {
    const serviceId = $(this).data("service-id");
    deleteService(serviceId);
  });

  // Handle cancel buttons
  $(document).on("click", "#serviceModal .modal-close", function () {
    closeServiceModal();
  });

  $(document).on("click", "#deleteServiceModal .modal-close", function () {
    $("#deleteServiceModal").addClass("hidden");
  });
}

function openServiceModal(
  serviceId = null,
  serviceName = "",
  serviceStatus = true
) {
  // Reset form
  $("#serviceForm")[0].reset();
  $("#serviceForm").find(".error-message").remove();
  $("#serviceForm").find(".border-red-500").removeClass("border-red-500");

  if (serviceId) {
    // Edit mode
    $("#serviceModalTitle").text("Edit Service");
    $("#serviceId").val(serviceId);
    $("#serviceName").val(serviceName);
    $("#serviceStatus").val(serviceStatus ? "true" : "false");
    $("#serviceSubmitBtn").text("Update");
  } else {
    // Add mode
    $("#serviceModalTitle").text("Add Service");
    $("#serviceId").val("");
    $("#serviceStatus").val("true");
    $("#serviceSubmitBtn").text("Submit");
  }

  // Show modal
  $("#serviceModal").removeClass("hidden");
}

function closeServiceModal() {
  $("#serviceModal").addClass("hidden");
  $("#serviceForm")[0].reset();
  $("#serviceForm").find(".error-message").remove();
  $("#serviceForm").find(".border-red-500").removeClass("border-red-500");
}

function submitServiceForm() {
  const formData = {
    id: $("#serviceId").val(),
    name: $("#serviceName").val(),
    status: $("#serviceStatus").val(),
  };

  // Clear previous errors
  $("#serviceForm").find(".error-message").remove();
  $("#serviceForm").find(".border-red-500").removeClass("border-red-500");

  // Show loading state
  $("#serviceSubmitBtn").prop("disabled", true).text("Saving...");

  $.ajax({
    url: "/save-service",
    type: "POST",
    data: formData,
    success: function (response) {
      // Success - reload page or update table
      location.reload();
    },
    error: function (xhr) {
      // Handle validation errors
      if (xhr.status === 422) {
        const errors = xhr.responseJSON.errors || [];
        displayValidationErrors(errors);
      } else {
        alert("An error occurred while saving the service.");
      }
    },
    complete: function () {
      // Reset button state
      $("#serviceSubmitBtn").prop("disabled", false);
      if (formData.id) {
        $("#serviceSubmitBtn").text("Update");
      } else {
        $("#serviceSubmitBtn").text("Submit");
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
      `#service${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).addClass("border-red-500");

    // Add error message
    const errorDiv = $(
      `<div class="error-message text-red-500 text-xs mt-1">${errorMessage}</div>`
    );
    $(
      `#service${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).after(errorDiv);
  });
}

function confirmDeleteService(serviceId, serviceName) {
  $("#deleteServiceName").text(serviceName);
  $("#confirmDeleteService").data("service-id", serviceId);
  $("#deleteServiceModal").removeClass("hidden");
}

function deleteService(serviceId) {
  const $deleteBtn = $("#confirmDeleteService");
  const $btnText = $deleteBtn.find(".delete-btn-text");
  const $btnLoader = $deleteBtn.find(".delete-btn-loader");
  
  // Prevent multiple clicks
  if ($deleteBtn.prop("disabled")) return;
  
  // Set loading state
  $deleteBtn.prop("disabled", true).addClass("opacity-50 cursor-not-allowed");
  $btnText.addClass("hidden");
  $btnLoader.removeClass("hidden");
  
  $.ajax({
    url: `/delete-service/${serviceId}`,
    type: "POST",
    success: function (response) {
      // Success - reload page or remove row
      location.reload();
    },
    error: function (xhr) {
      alert("An error occurred while deleting the service.");
      // Reset loading state on error
      $deleteBtn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
      $btnText.removeClass("hidden");
      $btnLoader.addClass("hidden");
    },
  });
}

// Close modals when clicking outside or on close buttons
$(document).on("click", ".modal-backdrop", function () {
  closeServiceModal();
  $("#deleteServiceModal").addClass("hidden");
});

// Close service modal specifically
$(document).on("click", "#serviceModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  closeServiceModal();
});

// Close delete modal specifically
$(document).on("click", "#deleteServiceModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $("#deleteServiceModal").addClass("hidden");
});

// Prevent modal from closing when clicking inside modal content
$(document).on("click", ".modal-content", function (e) {
  e.stopPropagation();
});

// Additional handlers for cancel buttons
$(document).on(
  "click",
  "#serviceModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeServiceModal();
  }
);

$(document).on(
  "click",
  "#deleteServiceModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#deleteServiceModal").addClass("hidden");
  }
);
