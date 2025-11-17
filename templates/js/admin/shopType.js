// Shop Type Management JavaScript
$(document).ready(function () {
  // Initialize DataTable or any other initialization
  initializeShopTypeManagement();
});

function initializeShopTypeManagement() {
  // Handle add button click
  $("#addShopTypeBtn").on("click", function () {
    openShopTypeModal();
  });

  // Handle edit button clicks
  $(document).on("click", ".edit-shop-type-btn", function () {
    const shopTypeId = $(this).data("id");
    const shopTypeName = $(this).data("name");
    const shopTypeStatus = $(this).data("status");
    const shopTypeIcon = $(this).data("icon") || null;
    openShopTypeModal(shopTypeId, shopTypeName, shopTypeStatus, shopTypeIcon);
  });

  // Handle form submission
  $("#shopTypeForm").on("submit", function (e) {
    e.preventDefault();
    submitShopTypeForm();
  });

  // Handle delete button clicks
  $(document).on("click", ".delete-shop-type-btn", function () {
    const shopTypeId = $(this).data("id");
    const shopTypeName = $(this).data("name");
    confirmDeleteShopType(shopTypeId, shopTypeName);
  });

  // Handle delete confirmation
  $("#confirmDeleteShopType").on("click", function () {
    const shopTypeId = $(this).data("shop-type-id");
    deleteShopType(shopTypeId);
  });

  // Handle cancel buttons
  $(document).on("click", "#shopTypeModal .modal-close", function () {
    closeShopTypeModal();
  });

  $(document).on("click", "#deleteShopTypeModal .modal-close", function () {
    $("#deleteShopTypeModal").addClass("hidden");
  });
}

function openShopTypeModal(
  shopTypeId = null,
  shopTypeName = "",
  shopTypeStatus = true,
  shopTypeIcon = null
) {
  // Reset form
  $("#shopTypeForm")[0].reset();
  $("#shopTypeForm").find(".error-message").remove();
  $("#shopTypeForm").find(".border-red-500").removeClass("border-red-500");
  $("#iconPreview").addClass("hidden");
  $("#iconPreviewImg").attr("src", "");

  if (shopTypeId) {
    // Edit mode
    $("#shopTypeModalTitle").text("Edit Shop Type");
    $("#shopTypeId").val(shopTypeId);
    $("#shopTypeName").val(shopTypeName);
    $("#shopTypeStatus").val(shopTypeStatus ? "true" : "false");
    $("#shopTypeSubmitBtn").text("Update");
    
    // Show existing icon if available
    if (shopTypeIcon) {
      $("#iconPreview").removeClass("hidden");
      $("#iconPreviewImg").attr("src", shopTypeIcon);
    }
  } else {
    // Add mode
    $("#shopTypeModalTitle").text("Add Shop Type");
    $("#shopTypeId").val("");
    $("#shopTypeStatus").val("true");
    $("#shopTypeSubmitBtn").text("Submit");
  }

  // Show modal
  $("#shopTypeModal").removeClass("hidden");
}

// Handle icon preview
$(document).on("change", "#shopTypeIcon", function () {
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

function closeShopTypeModal() {
  $("#shopTypeModal").addClass("hidden");
  $("#shopTypeForm")[0].reset();
  $("#shopTypeForm").find(".error-message").remove();
  $("#shopTypeForm").find(".border-red-500").removeClass("border-red-500");
}

function submitShopTypeForm() {
  const formData = new FormData();
  formData.append("id", $("#shopTypeId").val());
  formData.append("name", $("#shopTypeName").val());
  formData.append("status", $("#shopTypeStatus").val());
  
  // Append icon file if selected
  const iconFile = $("#shopTypeIcon")[0].files[0];
  if (iconFile) {
    formData.append("icon", iconFile);
  }

  // Clear previous errors
  $("#shopTypeForm").find(".error-message").remove();
  $("#shopTypeForm").find(".border-red-500").removeClass("border-red-500");

  // Show loading state
  $("#shopTypeSubmitBtn").prop("disabled", true).text("Saving...");

  $.ajax({
    url: "/save-shop-type",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
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
        alert("An error occurred while saving the shop type.");
      }
    },
    complete: function () {
      // Reset button state
      $("#shopTypeSubmitBtn").prop("disabled", false);
      const shopTypeId = $("#shopTypeId").val();
      if (shopTypeId) {
        $("#shopTypeSubmitBtn").text("Update");
      } else {
        $("#shopTypeSubmitBtn").text("Submit");
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
      `#shopType${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).addClass("border-red-500");

    // Add error message
    const errorDiv = $(
      `<div class="error-message text-red-500 text-xs mt-1">${errorMessage}</div>`
    );
    $(
      `#shopType${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    ).after(errorDiv);
  });
}

function confirmDeleteShopType(shopTypeId, shopTypeName) {
  $("#deleteShopTypeName").text(shopTypeName);
  $("#confirmDeleteShopType").data("shop-type-id", shopTypeId);
  $("#deleteShopTypeModal").removeClass("hidden");
}

function deleteShopType(shopTypeId) {
  const $deleteBtn = $("#confirmDeleteShopType");
  const $btnText = $deleteBtn.find(".delete-btn-text");
  const $btnLoader = $deleteBtn.find(".delete-btn-loader");
  
  // Prevent multiple clicks
  if ($deleteBtn.prop("disabled")) return;
  
  // Set loading state
  $deleteBtn.prop("disabled", true).addClass("opacity-50 cursor-not-allowed");
  $btnText.addClass("hidden");
  $btnLoader.removeClass("hidden");
  
  $.ajax({
    url: `/delete-shop-type/${shopTypeId}`,
    type: "POST",
    success: function (response) {
      // Success - reload page or remove row
      location.reload();
    },
    error: function (xhr) {
      alert("An error occurred while deleting the shop type.");
      // Reset loading state on error
      $deleteBtn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
      $btnText.removeClass("hidden");
      $btnLoader.addClass("hidden");
    },
  });
}

// Close modals when clicking outside or on close buttons
$(document).on("click", ".modal-backdrop", function () {
  closeShopTypeModal();
  $("#deleteShopTypeModal").addClass("hidden");
});

// Close shop type modal specifically
$(document).on("click", "#shopTypeModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  closeShopTypeModal();
});

// Close delete modal specifically
$(document).on("click", "#deleteShopTypeModal .modal-close", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $("#deleteShopTypeModal").addClass("hidden");
});

// Prevent modal from closing when clicking inside modal content
$(document).on("click", ".modal-content", function (e) {
  e.stopPropagation();
});

// Additional handlers for cancel buttons
$(document).on(
  "click",
  "#shopTypeModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeShopTypeModal();
  }
);

$(document).on(
  "click",
  "#deleteShopTypeModal button[type='button'].modal-close",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#deleteShopTypeModal").addClass("hidden");
  }
);
