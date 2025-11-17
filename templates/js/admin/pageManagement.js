// Page Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Delete Page Button Clicks
  document.addEventListener("click", function (e) {
    if (e.target.closest(".delete-page-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".delete-page-btn");
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");

      confirmDeletePage(id, name);
    }
  });

  // Confirm Delete Page
  function confirmDeletePage(pageId, pageName) {
    document.getElementById("deletePageName").textContent = pageName;
    document.getElementById("confirmDeletePage").setAttribute("data-page-id", pageId);
    document.getElementById("delete-page-modal").classList.remove("hidden");
  }

  // Delete Page Handler
  document.addEventListener("click", function (e) {
    if (e.target.id === "confirmDeletePage") {
      const pageId = e.target.getAttribute("data-page-id");
      if (pageId) {
        deletePage(pageId);
      }
    }
  });

  // Delete Page Function
  function deletePage(pageId) {
    const deleteBtn = document.getElementById("confirmDeletePage");
    const btnText = deleteBtn.querySelector(".delete-btn-text");
    const btnLoader = deleteBtn.querySelector(".delete-btn-loader");
    
    // Prevent multiple clicks
    if (deleteBtn.disabled) return;
    
    // Set loading state
    deleteBtn.disabled = true;
    deleteBtn.classList.add("opacity-50", "cursor-not-allowed");
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
    
    fetch(`/delete-page/${pageId}`, {
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
          document.getElementById("delete-page-modal").classList.add("hidden");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message || "Error deleting page", "error");
          // Reset loading state on error
          deleteBtn.disabled = false;
          deleteBtn.classList.remove("opacity-50", "cursor-not-allowed");
          btnText.classList.remove("hidden");
          btnLoader.classList.add("hidden");
        }
      })
      .catch((error) => {
        console.error("Error deleting page:", error);
        showNotification("Error deleting page: " + error.message, "error");
        // Reset loading state on error
        deleteBtn.disabled = false;
        deleteBtn.classList.remove("opacity-50", "cursor-not-allowed");
        btnText.classList.remove("hidden");
        btnLoader.classList.add("hidden");
      });
  }

  // Close delete modal when clicking backdrop or close button
  document.addEventListener("click", function (e) {
    const deleteModal = document.getElementById("delete-page-modal");
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
});

