// Professional Skill Management JavaScript
$(document).ready(function () {
  // Initialize Professional Skill Management
  initializeProfessionalSkillManagement();
});

function initializeProfessionalSkillManagement() {
  // Handle add button click
  $("#addProfessionalSkillBtn").on("click", function () {
    openProfessionalSkillModal();
  });

  // Handle edit button clicks
  $(document).on("click", ".edit-professional-skill-btn", function () {
    const professionalSkillId = $(this).data("id");
    const professionalSkillName = $(this).data("name");
    const professionalSkillStatus = $(this).data("status");
    openProfessionalSkillModal(
      professionalSkillId,
      professionalSkillName,
      professionalSkillStatus
    );
  });

  // Handle form submission
  $("#professionalSkillForm").on("submit", function (e) {
    e.preventDefault();
    submitProfessionalSkillForm();
  });

  // Handle delete button clicks
  $(document).on("click", ".delete-professional-skill-btn", function () {
    const professionalSkillId = $(this).data("id");
    const professionalSkillName = $(this).data("name");
    confirmDeleteProfessionalSkill(professionalSkillId, professionalSkillName);
  });

  // Handle delete confirmation
  $("#confirmDeleteProfessionalSkill").on("click", function () {
    const professionalSkillId = $(this).data("professional-skill-id");
    deleteProfessionalSkill(professionalSkillId);
  });

  // Handle cancel buttons
  $(document).on("click", "#professionalSkillModal .modal-close", function () {
    closeProfessionalSkillModal();
  });

  $(document).on(
    "click",
    "#deleteProfessionalSkillModal .modal-close",
    function () {
      $("#deleteProfessionalSkillModal").addClass("hidden");
    }
  );
}

function openProfessionalSkillModal(
  professionalSkillId = null,
  professionalSkillName = "",
  professionalSkillStatus = true
) {
  // Reset form
  $("#professionalSkillForm")[0].reset();
  $("#professionalSkillForm").find(".error-message").remove();
  $("#professionalSkillForm")
    .find(".border-red-500")
    .removeClass("border-red-500");

  if (professionalSkillId) {
    // Edit mode
    $("#professionalSkillModalTitle").text("Edit Professional Skill");
    $("#professionalSkillId").val(professionalSkillId);
    $("#professionalSkillName").val(professionalSkillName);
    $("#professionalSkillStatus").val(
      professionalSkillStatus ? "true" : "false"
    );
    $("#professionalSkillSubmitBtn").text("Update");
  } else {
    // Add mode
    $("#professionalSkillModalTitle").text("Add Professional Skill");
    $("#professionalSkillId").val("");
    $("#professionalSkillStatus").val("true");
    $("#professionalSkillSubmitBtn").text("Submit");
  }

  // Show modal
  $("#professionalSkillModal").removeClass("hidden");
}

function closeProfessionalSkillModal() {
  $("#professionalSkillModal").addClass("hidden");
  $("#professionalSkillForm")[0].reset();
  $("#professionalSkillForm").find(".error-message").remove();
  $("#professionalSkillForm")
    .find(".border-red-500")
    .removeClass("border-red-500");
}

function submitProfessionalSkillForm() {
  const formData = {
    id: $("#professionalSkillId").val(),
    name: $("#professionalSkillName").val(),
    status: $("#professionalSkillStatus").val(),
  };

  // Clear previous errors
  $("#professionalSkillForm").find(".error-message").remove();
  $("#professionalSkillForm")
    .find(".border-red-500")
    .removeClass("border-red-500");

  // Show loading state
  $("#professionalSkillSubmitBtn").prop("disabled", true).text("Saving...");

  $.ajax({
    url: "/save-professional-skill",
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
        alert("An error occurred while saving the professional skill.");
      }
    },
    complete: function () {
      // Reset button state
      $("#professionalSkillSubmitBtn").prop("disabled", false);
      if (formData.id) {
        $("#professionalSkillSubmitBtn").text("Update");
      } else {
        $("#professionalSkillSubmitBtn").text("Submit");
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
      `#professionalSkill${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      }`
    ).addClass("border-red-500");

    // Add error message
    const errorDiv = $(
      `<div class="error-message text-red-500 text-xs mt-1">${errorMessage}</div>`
    );
    $(
      `#professionalSkill${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      }`
    ).after(errorDiv);
  });
}

function confirmDeleteProfessionalSkill(
  professionalSkillId,
  professionalSkillName
) {
  $("#deleteProfessionalSkillName").text(professionalSkillName);
  $("#confirmDeleteProfessionalSkill").data(
    "professional-skill-id",
    professionalSkillId
  );
  $("#deleteProfessionalSkillModal").removeClass("hidden");
}

function deleteProfessionalSkill(professionalSkillId) {
  const $deleteBtn = $("#confirmDeleteProfessionalSkill");
  const $btnText = $deleteBtn.find(".delete-btn-text");
  const $btnLoader = $deleteBtn.find(".delete-btn-loader");
  
  // Prevent multiple clicks
  if ($deleteBtn.prop("disabled")) return;
  
  // Set loading state
  $deleteBtn.prop("disabled", true).addClass("opacity-50 cursor-not-allowed");
  $btnText.addClass("hidden");
  $btnLoader.removeClass("hidden");
  
  $.ajax({
    url: `/delete-professional-skill/${professionalSkillId}`,
    type: "POST",
    success: function (response) {
      // Success - reload page or remove row
      location.reload();
    },
    error: function (xhr) {
      alert("An error occurred while deleting the professional skill.");
      // Reset loading state on error
      $deleteBtn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
      $btnText.removeClass("hidden");
      $btnLoader.addClass("hidden");
    },
  });
}

// Close modals when clicking outside or on close buttons
$(document).on("click", ".modal-backdrop", function () {
  closeProfessionalSkillModal();
  $("#deleteProfessionalSkillModal").addClass("hidden");
});

// Close professional skill modal specifically
$(document).on("click", "#professionalSkillModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  closeProfessionalSkillModal();
});

// Close delete modal specifically
$(document).on(
  "click",
  "#deleteProfessionalSkillModal .modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#deleteProfessionalSkillModal").addClass("hidden");
  }
);

// Prevent modal from closing when clicking inside modal content
$(document).on("click", ".modal-content", function (e) {
  e.stopPropagation();
});

// Additional handlers for cancel buttons
$(document).on(
  "click",
  "#professionalSkillModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeProfessionalSkillModal();
  }
);

$(document).on(
  "click",
  "#deleteProfessionalSkillModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#deleteProfessionalSkillModal").addClass("hidden");
  }
);
