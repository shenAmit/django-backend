// Permission Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const permissionModal = document.getElementById("permissionModal");
  const permissionForm = document.getElementById("permissionForm");
  const permissionModalTitle = document.getElementById("permissionModalTitle");
  const permissionSubmitText = document.getElementById("permissionSubmitText");
  const permissionSubmitLoader = document.getElementById(
    "permissionSubmitLoader"
  );
  const confirmPermissionBtn = document.getElementById("confirmPermissionBtn");

  // Form elements
  const permissionId = document.getElementById("permissionId");
  const permissionName = document.getElementById("permissionName");

  // Add Permission Button
  const addPermissionBtn = document.getElementById("addPermissionBtn");

  // Add Permission Button Click
  if (addPermissionBtn) {
    addPermissionBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openAddPermissionModal();
    });
  }

  // Edit Permission Button Click
  document.addEventListener("click", function (e) {
    if (e.target.closest(".edit-permission-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".edit-permission-btn");
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");

      openEditPermissionModal(id, name);
    }
  });

  // Modal close functionality
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal-backdrop")
    ) {
      closePermissionModal();
    }
  });

  // Form submission
  if (permissionForm) {
    permissionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitPermissionForm();
    });
  }

  // Functions
  function openAddPermissionModal() {
    resetPermissionForm();
    permissionModalTitle.textContent = "Add Permission";
    permissionSubmitText.textContent = "Add Permission";
    permissionModal.classList.remove("hidden");
  }

  function openEditPermissionModal(id, name) {
    resetPermissionForm();
    permissionModalTitle.textContent = "Edit Permission";
    permissionSubmitText.textContent = "Update Permission";

    // Populate form fields
    permissionId.value = id;
    permissionName.value = name;

    permissionModal.classList.remove("hidden");
  }

  function closePermissionModal() {
    permissionModal.classList.add("hidden");
    resetPermissionForm();
  }

  function resetPermissionForm() {
    permissionForm.reset();
    permissionId.value = "";
    clearPermissionFormErrors();
  }

  function clearPermissionFormErrors() {
    const errorElements = document.querySelectorAll('[id$="Error"]');
    errorElements.forEach((element) => {
      element.classList.add("hidden");
      element.textContent = "";
    });
  }

  function showPermissionFormError(field, message) {
    const errorElement = document.getElementById(field + "Error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
  }

  function setLoadingState(loading) {
    if (loading) {
      confirmPermissionBtn.disabled = true;
      permissionSubmitText.classList.add("hidden");
      permissionSubmitLoader.classList.remove("hidden");
    } else {
      confirmPermissionBtn.disabled = false;
      permissionSubmitText.classList.remove("hidden");
      permissionSubmitLoader.classList.add("hidden");
    }
  }

  async function submitPermissionForm() {
    clearPermissionFormErrors();
    setLoadingState(true);

    const formData = new FormData(permissionForm);
    const data = Object.fromEntries(formData);

    console.log("Submitting permission data:", data);

    try {
      const response = await fetch("/save-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response result:", result);

      if (result.status) {
        // Success
        closePermissionModal();
        // Show success message
        showNotification("Permission saved successfully!", "success");
        // Reload the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Handle validation errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => {
            showPermissionFormError(error.path, error.msg);
          });
        } else {
          showNotification(result.message || "An error occurred", "error");
        }
      }
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        showNotification("Network error: Unable to connect to server", "error");
      } else if (error.message.includes("HTTP error")) {
        showNotification(`Server error: ${error.message}`, "error");
      } else {
        showNotification(
          "An error occurred while saving the permission",
          "error"
        );
      }
    } finally {
      setLoadingState(false);
    }
  }

  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});
