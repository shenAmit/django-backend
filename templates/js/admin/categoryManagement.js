// Category Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const categoryModal = document.getElementById("categoryModal");
  const categoryForm = document.getElementById("categoryForm");
  const categoryModalTitle = document.getElementById("categoryModalTitle");
  const categorySubmitText = document.getElementById("categorySubmitText");
  const categorySubmitLoader = document.getElementById("categorySubmitLoader");
  const confirmCategoryBtn = document.getElementById("confirmCategoryBtn");

  // Form elements
  const categoryId = document.getElementById("categoryId");
  const categoryName = document.getElementById("categoryName");
  const categoryDescription = document.getElementById("categoryDescription");
  const categoryStatus = document.getElementById("categoryStatus");
  const categoryImage = document.getElementById("categoryImage");
  const categoryImagePreview = document.getElementById("categoryImagePreview");

  // Add Category Button
  const addCategoryBtn = document.getElementById("addCategoryBtn");

  // Add Category Button Click
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", function () {
      openAddCategoryModal();
    });
  }

  // Edit Category Button Clicks
  document.addEventListener("click", function (e) {
    if (e.target.closest(".edit-category-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".edit-category-btn");
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const description = button.getAttribute("data-description");
      const status = button.getAttribute("data-status");
      const image = button.getAttribute("data-image");

      openEditCategoryModal(id, name, description, status, image);
    }
  });

  // Modal close functionality
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal-backdrop")
    ) {
      closeCategoryModal();
    }
  });

  // Form submission
  if (categoryForm) {
    categoryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitCategoryForm();
    });
  }

  // Image preview functionality
  if (categoryImage) {
    categoryImage.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          categoryImagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Description character count functionality
  if (categoryDescription) {
    const descriptionCharCount = document.getElementById(
      "descriptionCharCount"
    );

    categoryDescription.addEventListener("input", function (e) {
      const currentLength = e.target.value.length;
      if (descriptionCharCount) {
        descriptionCharCount.textContent = currentLength;

        // Change color based on character count
        if (currentLength > 450) {
          descriptionCharCount.classList.add("text-red-500");
          descriptionCharCount.classList.remove("text-gray-500");
        } else {
          descriptionCharCount.classList.add("text-gray-500");
          descriptionCharCount.classList.remove("text-red-500");
        }
      }
    });
  }

  // Functions
  function openAddCategoryModal() {
    resetCategoryForm();
    categoryModalTitle.textContent = "Add Category";
    categorySubmitText.textContent = "Add Category";
    categoryModal.classList.remove("hidden");
  }

  function openEditCategoryModal(id, name, description, status, image) {
    resetCategoryForm();
    categoryModalTitle.textContent = "Edit Category";
    categorySubmitText.textContent = "Update Category";

    // Populate form fields
    categoryId.value = id;
    categoryName.value = name;
    categoryDescription.value = description || "";
    categoryStatus.value = status;

    // Set image preview
    if (image && image !== "") {
      categoryImagePreview.src = image;
    } else {
      categoryImagePreview.src = "/images/default-avatar.svg";
    }

    categoryModal.classList.remove("hidden");
  }

  function closeCategoryModal() {
    categoryModal.classList.add("hidden");
    resetCategoryForm();
  }

  function resetCategoryForm() {
    categoryForm.reset();
    categoryId.value = "";
    categoryDescription.value = "";
    categoryImagePreview.src = "/images/default-avatar.svg";

    // Reset character count
    const descriptionCharCount = document.getElementById(
      "descriptionCharCount"
    );
    if (descriptionCharCount) {
      descriptionCharCount.textContent = "0";
      descriptionCharCount.classList.add("text-gray-500");
      descriptionCharCount.classList.remove("text-red-500");
    }

    clearCategoryFormErrors();
  }

  function clearCategoryFormErrors() {
    const errorElements = document.querySelectorAll('[id$="Error"]');
    errorElements.forEach((element) => {
      element.classList.add("hidden");
      element.textContent = "";
    });
  }

  function displayCategoryFormErrors(errors) {
    clearCategoryFormErrors();

    errors.forEach((error) => {
      const fieldName = error.path || error.param;
      const errorElement = document.getElementById(fieldName + "Error");
      if (errorElement) {
        errorElement.textContent = error.msg;
        errorElement.classList.remove("hidden");
      }
    });
  }

  function showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function submitCategoryForm() {
    const formData = new FormData(categoryForm);
    const isEdit = categoryId.value !== "";

    // Show loading state
    confirmCategoryBtn.disabled = true;
    categorySubmitText.classList.add("hidden");
    categorySubmitLoader.classList.remove("hidden");

    const url = isEdit ? "/save-category" : "/save-category";
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showNotification(data.message, "success");
          closeCategoryModal();
          // Reload the page to show updated data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message, "error");
          if (data.errors) {
            displayCategoryFormErrors(data.errors);
          }
        }
      })
      .catch((error) => {
        console.error("Error submitting category:", error);
        showNotification(
          "Error submitting category: " + error.message,
          "error"
        );
      })
      .finally(() => {
        // Reset loading state
        confirmCategoryBtn.disabled = false;
        categorySubmitText.classList.remove("hidden");
        categorySubmitLoader.classList.add("hidden");
      });
  }

  // Delete Category Button Clicks
  document.addEventListener("click", function (e) {
    if (e.target.closest(".delete-category-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".delete-category-btn");
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");

      confirmDeleteCategory(id, name);
    }
  });

  // Confirm Delete Category
  function confirmDeleteCategory(categoryId, categoryName) {
    document.getElementById("deleteCategoryName").textContent = categoryName;
    document.getElementById("confirmDeleteCategory").setAttribute("data-category-id", categoryId);
    document.getElementById("deleteCategoryModal").classList.remove("hidden");
  }

  // Delete Category Handler
  document.addEventListener("click", function (e) {
    if (e.target.id === "confirmDeleteCategory") {
      const categoryId = e.target.getAttribute("data-category-id");
      if (categoryId) {
        deleteCategory(categoryId);
      }
    }
  });

  // Delete Category Function
  function deleteCategory(categoryId) {
    const deleteBtn = document.getElementById("confirmDeleteCategory");
    const btnText = deleteBtn.querySelector(".delete-btn-text");
    const btnLoader = deleteBtn.querySelector(".delete-btn-loader");
    
    // Prevent multiple clicks
    if (deleteBtn.disabled) return;
    
    // Set loading state
    deleteBtn.disabled = true;
    deleteBtn.classList.add("opacity-50", "cursor-not-allowed");
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
    
    fetch(`/delete-category/${categoryId}`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showNotification(data.message, "success");
          document.getElementById("deleteCategoryModal").classList.add("hidden");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message || "Error deleting category", "error");
          // Reset loading state on error
          deleteBtn.disabled = false;
          deleteBtn.classList.remove("opacity-50", "cursor-not-allowed");
          btnText.classList.remove("hidden");
          btnLoader.classList.add("hidden");
        }
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        // Reset loading state on error
        deleteBtn.disabled = false;
        deleteBtn.classList.remove("opacity-50", "cursor-not-allowed");
        btnText.classList.remove("hidden");
        btnLoader.classList.add("hidden");
        showNotification("Error deleting category: " + error.message, "error");
      });
  }

  // Close delete modal when clicking backdrop or close button
  document.addEventListener("click", function (e) {
    const deleteModal = document.getElementById("deleteCategoryModal");
    if (
      deleteModal &&
      !deleteModal.classList.contains("hidden") &&
      (e.target.classList.contains("modal-backdrop") ||
        e.target.classList.contains("modal-close"))
    ) {
      deleteModal.classList.add("hidden");
    }
  });

  // Prevent modal from closing when clicking inside modal content
  document.addEventListener("click", function (e) {
    if (e.target.closest(".modal-content")) {
      e.stopPropagation();
    }
  });
});
