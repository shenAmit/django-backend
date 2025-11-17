// User Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Delete User Modal
  const deleteUserModal = document.getElementById("deleteUserModal");
  const deleteUserName = document.getElementById("deleteUserName");
  const confirmDeleteUser = document.getElementById("confirmDeleteUser");
  let userIdToDelete = null;

  // Edit User Modal
  const editUserModal = document.getElementById("editUserModal");
  const editUserForm = document.getElementById("editUserForm");
  const confirmEditUser = document.getElementById("confirmEditUser");
  let userIdToEdit = null;

  // View User Modal
  const viewUserModal = document.getElementById("viewUserModal");
  let userIdToView = null;

  // Edit Hours Modal
  const editHoursModal = document.getElementById("editHoursModal");
  const editHoursForm = document.getElementById("editHoursForm");
  const confirmEditHours = document.getElementById("confirmEditHours");
  let userIdToEditHours = null;

  // Delete User Event Listeners
  document.addEventListener("click", function (e) {
    if (e.target.closest(".delete-user-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".delete-user-btn");
      userIdToDelete = button.getAttribute("data-id");
      const userName = button.getAttribute("data-name");

      if (deleteUserName) deleteUserName.textContent = userName;
      if (deleteUserModal) deleteUserModal.classList.remove("hidden");
    }
  });

  // Edit Hours Event Listeners
  document.addEventListener("click", function (e) {
    if (e.target.closest(".edit-hours-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".edit-hours-btn");
      userIdToEditHours = button.getAttribute("data-id");
      const userName = button.getAttribute("data-name");

      // Set user name in modal
      document.getElementById("editHoursUserName").textContent = userName;

      // Show loading state
      button.disabled = true;
      button.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-green-600 dark:text-green-400 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;

      // Fetch operation hours data
      fetchOperationHours(userIdToEditHours, button);
    }
  });

  // View User Event Listeners
  document.addEventListener("click", function (e) {
    if (e.target.closest(".view-user-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".view-user-btn");
      userIdToView = button.getAttribute("data-id");

      const originalContent = button.innerHTML;

      // Show loading state
      button.disabled = true;
      button.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-purple-600 dark:text-purple-400 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;

      // Fetch user data for view
      fetchUserDataForView(userIdToView, button, originalContent);
    }
  });

  // Edit User Event Listeners
  document.addEventListener("click", function (e) {
    if (e.target.closest(".edit-user-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".edit-user-btn");
      userIdToEdit = button.getAttribute("data-id");

      const originalContent = button.innerHTML;

      // Show loading state
      button.disabled = true;
      button.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;

      // Fetch user data
      fetchUserData(userIdToEdit, button, originalContent);
    }
  });

  // Block/Unblock User Event Listeners
  document.addEventListener("click", function (e) {
    if (
      e.target.closest(".block-user-btn") ||
      e.target.closest(".unblock-user-btn")
    ) {
      e.preventDefault();
      e.stopPropagation();

      const button =
        e.target.closest(".block-user-btn") ||
        e.target.closest(".unblock-user-btn");
      const userId = button.getAttribute("data-id");
      const userName = button.getAttribute("data-name");
      const action = button.classList.contains("block-user-btn")
        ? "block"
        : "unblock";

      toggleUserStatus(userId, action, userName);
    }
  });

  // Modal Close Event Listeners
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-close") ||
      e.target.closest(".modal-close")
    ) {
      closeAllModals();
    }
  });

  // Close modals when clicking outside
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-backdrop")) {
      closeAllModals();
    }
  });

  // Delete User Confirmation
  if (confirmDeleteUser) {
    confirmDeleteUser.addEventListener("click", function () {
      if (userIdToDelete) {
        deleteUser(userIdToDelete);
      }
    });
  }

  // Edit Hours Form Submission
  if (editHoursForm) {
    editHoursForm.addEventListener("submit", function (e) {
      e.preventDefault();
      updateOperationHours(userIdToEditHours);
    });
  }

  // Edit User Form Submission
  if (editUserForm) {
    editUserForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (userIdToEdit) {
        updateUser(userIdToEdit);
      }
    });
  }

  // Edit User Button Click (for button type="button")
  if (confirmEditUser) {
    confirmEditUser.addEventListener("click", function (e) {
      e.preventDefault();
      if (userIdToEdit) {
        updateUser(userIdToEdit);
      }
    });
  }

  // Profile image preview
  document.addEventListener("change", function (e) {
    if (e.target.id === "editUserProfileImage") {
      const file = e.target.files[0];
      const preview = document.getElementById("editUserProfilePreview");

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Role change event listener - removed since role field is now disabled
  // document.addEventListener("change", function (e) {
  //   if (e.target.id === "editUserRole") {
  //     // Get roles data from the dropdown options
  //     const roleSelect = e.target;
  //     const roles = Array.from(roleSelect.options)
  //       .map((option) => ({
  //         _id: option.value,
  //         name: option.textContent,
  //       }))
  //       .filter((role) => role._id !== "");

  //     toggleRoleSpecificFields(e.target.value, roles);
  //   }
  // });

  // Functions
  function closeAllModals() {
    if (deleteUserModal) deleteUserModal.classList.add("hidden");
    if (editUserModal) editUserModal.classList.add("hidden");
    if (editHoursModal) editHoursModal.classList.add("hidden");
    if (viewUserModal) viewUserModal.classList.add("hidden");
    userIdToDelete = null;
    userIdToEdit = null;
    userIdToEditHours = null;
    userIdToView = null;
    clearEditFormErrors();
    clearHoursFormErrors();
  }

  // Close hours modal function
  function closeHoursModal() {
    if (editHoursModal) editHoursModal.classList.add("hidden");
    userIdToEditHours = null;
    clearHoursFormErrors();
  }

  // Utility function to show loading state on any button
  function showButtonLoading(button, loadingText = "Loading...") {
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
      <svg class="animate-spin h-4 w-4 text-gray-700 dark:text-gray-300 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      ${loadingText}
    `;
    return originalContent;
  }

  // Utility function to hide loading state on any button
  function hideButtonLoading(button, originalContent) {
    button.disabled = false;
    button.innerHTML = originalContent;
  }

  function fetchUserData(userId, button = null, originalContent = null) {
    fetch(`/user-management/get-user/${userId}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Authentication error - redirect to login
            window.location.href = "/login";
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          populateEditForm(data.user, data.roles, data.shopTypes);
          if (editUserModal) {
            editUserModal.classList.remove("hidden");
          } else {
            console.error("Edit user modal not found");
            showNotification("Edit modal not found", "error");
          }
        } else {
          showNotification(
            "Error fetching user data: " + (data.message || "Unknown error"),
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Error fetching user data", "error");
      })
      .finally(() => {
        // Reset button state if provided
        if (button && originalContent) {
          button.disabled = false;
          button.innerHTML = originalContent;
        }
      });
  }

  function populateEditForm(user, roles, shopTypes) {
    // Populate form fields
    document.getElementById("editUserName").value = user.name || "";
    document.getElementById("editUserEmail").value = user.email || "";

    // Professional fields
    const professionInput = document.getElementById("editUserProfession");
    const phoneInput = document.getElementById("editUserPhone");
    if (professionInput) {
      professionInput.value = user.profession || "";
    }
    if (phoneInput) {
      phoneInput.value = user.professional_phone || "";
    }

    // Agent fields
    const licenseNumberInput = document.getElementById("editUserLicenseNumber");
    const yearOfExpInput = document.getElementById("editUserYearOfExp");
    const specializationInput = document.getElementById(
      "editUserSpecialization"
    );
    if (licenseNumberInput) {
      licenseNumberInput.value = user.licenseNumber || "";
    }
    if (yearOfExpInput) {
      yearOfExpInput.value = user.yearOfExp || "";
    }
    if (specializationInput) {
      specializationInput.value = user.specialization || "";
    }

    const isBlockCheckbox = document.getElementById("editUserIsBlock");
    if (isBlockCheckbox) {
      isBlockCheckbox.checked = user.isBlock || false;
    }

    // Set profile image preview
    const profilePreview = document.getElementById("editUserProfilePreview");
    if (profilePreview) {
      if (user.profilePicture) {
        // Handle both full URLs and filenames
        if (user.profilePicture.startsWith("http")) {
          profilePreview.src = user.profilePicture;
        } else {
          profilePreview.src = `/uploads/profile-pictures/${user.profilePicture}`;
        }
      } else {
        profilePreview.src = "/images/default-avatar.svg";
      }
    }

    // Populate roles dropdown
    const roleSelect = document.getElementById("editUserRole");
    if (roleSelect) {
      roleSelect.innerHTML = '<option value="">Select Role</option>';
      if (roles && Array.isArray(roles)) {
        roles.forEach((role) => {
          const option = document.createElement("option");
          option.value = role._id;
          option.textContent = role.name;
          // Check if user has this role
          if (
            user.roles &&
            user.roles.some((userRole) => userRole._id === role._id)
          ) {
            option.selected = true;
          }
          roleSelect.appendChild(option);
        });
      }
    }

    // Populate shop types dropdown
    const shopTypeSelect = document.getElementById("editUserShopType");
    if (shopTypeSelect) {
      shopTypeSelect.innerHTML = '<option value="">Select Shop Type</option>';
      if (shopTypes && Array.isArray(shopTypes)) {
        shopTypes.forEach((shopType) => {
          const option = document.createElement("option");
          option.value = shopType._id;
          option.textContent = shopType.name;
          // Check if user has this shop type
          if (user.shop_type && user.shop_type._id === shopType._id) {
            option.selected = true;
          }
          shopTypeSelect.appendChild(option);
        });
      }
    }

    // Show/hide fields based on current role
    const currentRoleId = roleSelect ? roleSelect.value : null;
    toggleRoleSpecificFields(currentRoleId, roles || []);
  }

  function toggleRoleSpecificFields(roleId, roles) {
    const shopTypeField = document.getElementById("shopTypeField");
    const shopTypeSelect = document.getElementById("editUserShopType");
    const professionalFields = document.getElementById("professionalFields");
    const professionInput = document.getElementById("editUserProfession");
    const phoneInput = document.getElementById("editUserPhone");
    const agentFields = document.getElementById("agentFields");
    const licenseNumberInput = document.getElementById("editUserLicenseNumber");
    const yearOfExpInput = document.getElementById("editUserYearOfExp");
    const specializationInput = document.getElementById(
      "editUserSpecialization"
    );

    if (!roleId) {
      if (shopTypeField) shopTypeField.classList.add("hidden");
      if (shopTypeSelect) shopTypeSelect.value = "";
      if (professionalFields) professionalFields.classList.add("hidden");
      if (professionInput) professionInput.value = "";
      if (phoneInput) phoneInput.value = "";
      if (agentFields) agentFields.classList.add("hidden");
      if (licenseNumberInput) licenseNumberInput.value = "";
      if (yearOfExpInput) yearOfExpInput.value = "";
      if (specializationInput) specializationInput.value = "";
      return;
    }

    // Find the role name by ID
    const selectedRole = roles.find((role) => role._id === roleId);

    if (selectedRole && selectedRole.name.toLowerCase() === "shop") {
      if (shopTypeField) shopTypeField.classList.remove("hidden");
      if (professionalFields) professionalFields.classList.add("hidden");
      if (agentFields) agentFields.classList.add("hidden");
      // Make shop type required for shop role
      if (shopTypeSelect) shopTypeSelect.setAttribute("required", "required");
      // Clear other fields
      if (professionInput) professionInput.value = "";
      if (phoneInput) phoneInput.value = "";
      if (licenseNumberInput) licenseNumberInput.value = "";
      if (yearOfExpInput) yearOfExpInput.value = "";
      if (specializationInput) specializationInput.value = "";
    } else if (
      selectedRole &&
      selectedRole.name.toLowerCase() === "professional"
    ) {
      if (shopTypeField) shopTypeField.classList.add("hidden");
      if (professionalFields) professionalFields.classList.remove("hidden");
      if (agentFields) agentFields.classList.add("hidden");
      // Make professional fields required
      if (professionInput) professionInput.setAttribute("required", "required");
      if (phoneInput) phoneInput.setAttribute("required", "required");
      // Clear other fields
      if (shopTypeSelect) {
        shopTypeSelect.removeAttribute("required");
        shopTypeSelect.value = "";
      }
      if (licenseNumberInput) licenseNumberInput.value = "";
      if (yearOfExpInput) yearOfExpInput.value = "";
      if (specializationInput) specializationInput.value = "";
    } else if (
      selectedRole &&
      (selectedRole.name.toLowerCase() === "agent" ||
        selectedRole.name.toLowerCase() === "realestate")
    ) {
      if (shopTypeField) shopTypeField.classList.add("hidden");
      if (professionalFields) professionalFields.classList.add("hidden");
      if (agentFields) agentFields.classList.remove("hidden");
      // Clear other fields
      if (shopTypeSelect) {
        shopTypeSelect.removeAttribute("required");
        shopTypeSelect.value = "";
      }
      if (professionInput) {
        professionInput.removeAttribute("required");
        professionInput.value = "";
      }
      if (phoneInput) {
        phoneInput.removeAttribute("required");
        phoneInput.value = "";
      }
    } else {
      if (shopTypeField) shopTypeField.classList.add("hidden");
      if (professionalFields) professionalFields.classList.add("hidden");
      if (agentFields) agentFields.classList.add("hidden");
      if (shopTypeSelect) {
        shopTypeSelect.removeAttribute("required");
        shopTypeSelect.value = "";
      }
      if (professionInput) {
        professionInput.removeAttribute("required");
        professionInput.value = "";
      }
      if (phoneInput) {
        phoneInput.removeAttribute("required");
        phoneInput.value = "";
      }
      if (licenseNumberInput) licenseNumberInput.value = "";
      if (yearOfExpInput) yearOfExpInput.value = "";
      if (specializationInput) specializationInput.value = "";
    }
  }

  function fetchUserDataForView(userId, button = null, originalContent = null) {
    fetch(`/user-management/get-user/${userId}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Authentication error - redirect to login
            window.location.href = "/login";
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          populateViewModal(data.user);
          if (viewUserModal) {
            viewUserModal.classList.remove("hidden");
          } else {
            console.error("View user modal not found");
            showNotification("View modal not found", "error");
          }
        } else {
          showNotification(
            "Error fetching user data: " + (data.message || "Unknown error"),
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Error fetching user data", "error");
      })
      .finally(() => {
        // Reset button state if provided
        if (button && originalContent) {
          button.disabled = false;
          button.innerHTML = originalContent;
        }
      });
  }

  function populateViewModal(user) {
    // Profile Picture
    const profilePicture = document.getElementById("viewUserProfilePicture");
    if (profilePicture) {
      if (user.profilePicture) {
        if (user.profilePicture.startsWith("http")) {
          profilePicture.src = user.profilePicture;
        } else {
          profilePicture.src = `/uploads/profile-pictures/${user.profilePicture}`;
        }
      } else {
        profilePicture.src = "/images/default-avatar.svg";
      }
    }

    // Basic Information
    setText("viewUserName", user.name || "N/A");
    setText("viewUserEmail", user.email || "N/A");
    setText("viewUserPhone", user.phone || "N/A");

    // Role
    if (user.roles && user.roles.length > 0) {
      const roleNames = user.roles.map((role) => role.name).join(", ");
      setText("viewUserRole", roleNames);
    } else {
      setText("viewUserRole", "N/A");
    }

    // Check if it's a shop user
    const isShop =
      user.roles &&
      user.roles.some(
        (role) => role.name && role.name.toLowerCase() === "shop"
      );
    const isProfessional =
      user.roles &&
      user.roles.some(
        (role) => role.name && role.name.toLowerCase() === "professional"
      );
    const isAgent =
      user.roles &&
      user.roles.some(
        (role) =>
          role.name &&
          (role.name.toLowerCase() === "agent" ||
            role.name.toLowerCase() === "realestate")
      );

    // Hide all role-specific sections first
    const professionalSection = document.getElementById(
      "viewProfessionalSection"
    );
    const shopSection = document.getElementById("viewShopSection");
    const agentSection = document.getElementById("viewAgentSection");

    if (professionalSection) professionalSection.classList.add("hidden");
    if (shopSection) shopSection.classList.add("hidden");
    if (agentSection) agentSection.classList.add("hidden");

    if (isShop) {
      // Show shop section
      if (shopSection) shopSection.classList.remove("hidden");

      // Shop Information
      const shopType = user.shop_type;
      setText(
        "viewUserShopType",
        shopType && shopType.name ? shopType.name : "N/A"
      );
      setText(
        "viewShopRating",
        user.avgRating ? `${user.avgRating.toFixed(1)} / 5.0` : "No ratings yet"
      );

      // Shop Services
      const servicesContainer = document.getElementById("viewUserServices");
      if (servicesContainer) {
        if (user.shopServices && user.shopServices.length > 0) {
          const servicesHTML = user.shopServices
            .map(
              (service) =>
                `<span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-2 mb-2">
              ${service.name || service}
            </span>`
            )
            .join("");
          servicesContainer.innerHTML = servicesHTML;
        } else {
          servicesContainer.innerHTML =
            '<span class="text-gray-500">No services added</span>';
        }
      }

      // Shop Amenities
      const amenitiesContainer = document.getElementById("viewUserAmenities");
      if (amenitiesContainer) {
        if (user.shop_amenities && user.shop_amenities.length > 0) {
          const amenitiesHTML = user.shop_amenities
            .map(
              (amenity) =>
                `<span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20 mr-2 mb-2">
              ${amenity.name || amenity}
            </span>`
            )
            .join("");
          amenitiesContainer.innerHTML = amenitiesHTML;
        } else {
          amenitiesContainer.innerHTML =
            '<span class="text-gray-500">No amenities added</span>';
        }
      }

      // Shop Address
      const shopAddress = user.shop_address || {};
      setText("viewShopAddress", shopAddress.address || "N/A");
      setText("viewUserLatitude", shopAddress.latitude || "N/A");
      setText("viewUserLongitude", shopAddress.longitude || "N/A");

      // Operation Hours
      const hoursContainer = document.getElementById("viewOperationHours");
      if (hoursContainer && user.operation_hours) {
        const days = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        const daysCapitalized = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        const hoursHTML = days
          .map((day, index) => {
            const dayData = user.operation_hours[day];
            const isOpen = dayData && dayData.is_open;
            const openTime =
              dayData && dayData.opening_time ? dayData.opening_time : "N/A";
            const closeTime =
              dayData && dayData.closing_time ? dayData.closing_time : "N/A";

            return `
            <div class="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <span class="font-medium text-gray-700 dark:text-gray-300">${
                daysCapitalized[index]
              }</span>
              <span class="text-gray-600 dark:text-gray-400">
                ${
                  isOpen
                    ? `${openTime} - ${closeTime}`
                    : '<span class="text-red-600 dark:text-red-400">Closed</span>'
                }
              </span>
            </div>
          `;
          })
          .join("");

        hoursContainer.innerHTML = hoursHTML;
      } else if (hoursContainer) {
        hoursContainer.innerHTML =
          '<p class="text-gray-500">No operation hours set</p>';
      }

      // Availability
      setText(
        "viewUserAvailability",
        user.isAvailable ? "Available" : "Not Available"
      );
    } else if (isProfessional) {
      // Show professional section
      if (professionalSection) professionalSection.classList.remove("hidden");

      // Professional Information
      setText("viewUserProfession", user.profession || "N/A");
      setText("viewUserProfessionalPhone", user.professional_phone || "N/A");
      setText(
        "viewUserExperience",
        user.yearsOfExperience ? `${user.yearsOfExperience} years` : "N/A"
      );
      setText(
        "viewUserRating",
        user.avgRating ? `${user.avgRating.toFixed(1)} / 5.0` : "No ratings yet"
      );

      // Professional Skills
      const skillsContainer = document.getElementById("viewUserSkills");
      if (skillsContainer) {
        if (user.professionalSkills && user.professionalSkills.length > 0) {
          const skillsHTML = user.professionalSkills
            .map(
              (skill) =>
                `<span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 mr-2 mb-2">
              ${skill.name || skill}
            </span>`
            )
            .join("");
          skillsContainer.innerHTML = skillsHTML;
        } else {
          skillsContainer.innerHTML =
            '<span class="text-gray-500">No skills added</span>';
        }
      }

      // Languages
      if (user.languages && user.languages.length > 0) {
        setText("viewUserLanguages", user.languages.join(", "));
      } else {
        setText("viewUserLanguages", "N/A");
      }

      // Portfolio Description
      setText(
        "viewUserPortfolio",
        user.portfolioDescription || "No description provided"
      );

      // Address Information
      const address = user.professional_address || user.profile_location || {};
      setText("viewUserAddress", address.address || "N/A");
      setText("viewUserCity", address.city || "N/A");
      setText("viewUserState", address.state || "N/A");
      setText("viewUserZipCode", address.zip_code || "N/A");
    } else if (isAgent) {
      // Show agent section
      if (agentSection) agentSection.classList.remove("hidden");

      // Agent Information
      const agentDetails = user.agent_details || {};
      setText("viewUserLicenseNumber", agentDetails.licenseNumber || "N/A");
      setText(
        "viewUserYearOfExp",
        user.yearsOfExperience ? `${user.yearsOfExperience} years` : "N/A"
      );
      setText("viewUserSpecialization", agentDetails.specialization || "N/A");
      setText(
        "viewAgentRating",
        user.avgRating ? `${user.avgRating.toFixed(1)} / 5.0` : "No ratings yet"
      );
    }

    // Status & Information (common for all)
    setText("viewUserStatus", user.isBlock ? "Blocked" : "Active");

    // Verified (show only for non-shop users)
    const verifiedContainer = document.getElementById(
      "viewUserVerifiedContainer"
    );
    if (verifiedContainer) {
      if (isShop) {
        verifiedContainer.classList.add("hidden");
      } else {
        verifiedContainer.classList.remove("hidden");
        setText(
          "viewUserVerified",
          user.isUserVerified ? "Verified" : "Not Verified"
        );
      }
    }

    // Joined Date
    if (user.createdAt) {
      const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setText("viewUserJoinedDate", joinedDate);
    } else {
      setText("viewUserJoinedDate", "N/A");
    }
  }

  // Helper function to set text content safely
  function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  }

  function updateUser(userId) {
    const formData = new FormData(editUserForm);

    // Handle checkbox values properly
    formData.set("isBlock", document.getElementById("editUserIsBlock").checked);

    // Show loading state
    const submitBtn = confirmEditUser;
    const submitText = document.getElementById("editSubmitText");
    const submitLoader = document.getElementById("editSubmitLoader");

    submitBtn.disabled = true;
    submitText.classList.add("hidden");
    submitLoader.classList.remove("hidden");

    fetch(`/user-management/edit/${userId}`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showNotification(data.message, "success");
          closeAllModals();
          // Reload the page to show updated data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message, "error");
          if (data.errors) {
            displayEditFormErrors(data.errors);
          }
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        console.error("Error details:", error.message);
        showNotification("Error updating user: " + error.message, "error");
      })
      .finally(() => {
        // Reset loading state
        submitBtn.disabled = false;
        submitText.classList.remove("hidden");
        submitLoader.classList.add("hidden");
      });
  }

  function deleteUser(userId) {
    const confirmBtn = document.getElementById("confirmDeleteUser");
    const btnText = confirmBtn.querySelector(".delete-btn-text");
    const btnLoader = confirmBtn.querySelector(".delete-btn-loader");
    
    // Prevent multiple clicks
    if (confirmBtn.disabled) return;

    // Show loading state
    confirmBtn.disabled = true;
    confirmBtn.classList.add("opacity-50", "cursor-not-allowed");
    if (btnText) btnText.classList.add("hidden");
    if (btnLoader) btnLoader.classList.remove("hidden");

    fetch(`/user-management/delete/${userId}`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showNotification(data.message, "success");
          closeAllModals();
          // Reload the page to show updated data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message, "error");
          // Reset loading state on error
          confirmBtn.disabled = false;
          confirmBtn.classList.remove("opacity-50", "cursor-not-allowed");
          if (btnText) btnText.classList.remove("hidden");
          if (btnLoader) btnLoader.classList.add("hidden");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Error deleting user", "error");
        // Reset loading state on error
        confirmBtn.disabled = false;
        confirmBtn.classList.remove("opacity-50", "cursor-not-allowed");
        if (btnText) btnText.classList.remove("hidden");
        if (btnLoader) btnLoader.classList.add("hidden");
      });
  }

  function toggleUserStatus(userId, action, userName) {
    // Find the button that was clicked
    const button = document.querySelector(
      `[data-id="${userId}"].${action}-user-btn`
    );
    if (!button) return;

    const originalContent = button.innerHTML;

    // Show loading state
    button.disabled = true;
    button.innerHTML = `
      <svg class="animate-spin h-4 w-4 text-white dark:text-gray-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;

    fetch(`/user-management/toggle-status/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ action }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showNotification(data.message, "success");
          // Reload the page to show updated data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Error updating user status", "error");
      })
      .finally(() => {
        // Reset loading state
        button.disabled = false;
        button.innerHTML = originalContent;
      });
  }

  function displayEditFormErrors(errors) {
    clearEditFormErrors();

    errors.forEach((error) => {
      const fieldName = error.path || error.param;
      const errorElement = document.getElementById(
        `edit${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Error`
      );

      if (errorElement) {
        errorElement.textContent = error.msg;
        errorElement.classList.remove("hidden");
      }
    });
  }

  function clearEditFormErrors() {
    const errorElements = document.querySelectorAll(
      '[id^="edit"][id$="Error"]'
    );
    errorElements.forEach((element) => {
      element.classList.add("hidden");
      element.textContent = "";
    });
  }

  function clearHoursFormErrors() {
    const hoursError = document.getElementById("hoursError");
    if (hoursError) {
      hoursError.classList.add("hidden");
      hoursError.textContent = "";
    }
  }

  // Operation Hours Functions
  function fetchOperationHours(userId, button = null) {
    fetch(`/user-management/operation-hours/${userId}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Authentication error - redirect to login
            window.location.href = "/login";
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          populateHoursForm(data.data);
          editHoursModal.classList.remove("hidden");
        } else {
          showNotification(
            "Error fetching operation hours: " + data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Error fetching operation hours", "error");
      })
      .finally(() => {
        // Reset button state if provided
        if (button) {
          button.disabled = false;
          button.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          `;
        }
      });
  }

  function populateHoursForm(operationHours) {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    days.forEach((day) => {
      const isOpenCheckbox = document.getElementById(`${day}_is_open`);
      const openingTimeInput = document.getElementById(`${day}_opening_time`);
      const closingTimeInput = document.getElementById(`${day}_closing_time`);

      if (operationHours[day]) {
        isOpenCheckbox.checked = operationHours[day].is_open;
        openingTimeInput.value = operationHours[day].opening_time || "09:00";
        closingTimeInput.value = operationHours[day].closing_time || "18:00";
      } else {
        isOpenCheckbox.checked = false;
        openingTimeInput.value = "09:00";
        closingTimeInput.value = "18:00";
      }
    });
  }

  function updateOperationHours(userId) {
    const formData = new FormData(editHoursForm);
    const operationHours = {};

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    days.forEach((day) => {
      const isOpen = formData.get(`${day}_is_open`) === "on";
      const openingTime = formData.get(`${day}_opening_time`);
      const closingTime = formData.get(`${day}_closing_time`);

      operationHours[day] = {
        is_open: isOpen,
        opening_time: isOpen ? openingTime : null,
        closing_time: isOpen ? closingTime : null,
      };
    });

    // Show loading state
    const submitBtn = confirmEditHours;
    const submitText = document.getElementById("hoursSubmitText");
    const submitLoader = document.getElementById("hoursSubmitLoader");

    submitBtn.disabled = true;
    submitText.classList.add("hidden");
    submitLoader.classList.remove("hidden");

    fetch(`/user-management/operation-hours/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ operation_hours: operationHours }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          showNotification(data.message, "success");
          closeHoursModal();
          // Reload the page to show updated data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification(data.message, "error");
          if (data.errors) {
            displayHoursFormErrors(data.errors);
          }
        }
      })
      .catch((error) => {
        console.error("Error updating operation hours:", error);
        showNotification(
          "Error updating operation hours: " + error.message,
          "error"
        );
      })
      .finally(() => {
        // Reset loading state
        submitBtn.disabled = false;
        submitText.classList.remove("hidden");
        submitLoader.classList.add("hidden");
      });
  }

  function displayHoursFormErrors(errors) {
    clearHoursFormErrors();

    const hoursError = document.getElementById("hoursError");
    if (hoursError && errors.length > 0) {
      hoursError.textContent = errors[0].msg;
      hoursError.classList.remove("hidden");
    }
  }

  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : type === "warning"
        ? "bg-yellow-500 text-white"
        : "bg-blue-500 text-white"
    }`;

    notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-1">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Escape key to close modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
});
