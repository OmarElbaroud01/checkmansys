document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, ${currentUser.username}`;
    updateTable();
  } else {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }

  document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        logoutUser();
      });
    }
  });

  document
    .getElementById("checkEntryForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      if (currentIndex === -1) {
        addEntry();
      } else {
        updateEntry(currentIndex);
      }
    });

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      performSearch();
    });
});

function logoutUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    // Log the logout for any user
    logOperation("Logout", `${currentUser.username} logged out`);

    // Clear the local storage or specific keys related to user session
    localStorage.removeItem("currentUser");

    // Redirect to login page or home page
    window.location.href = "login.html";
  }
}

let currentIndex = -1; // Global index to manage updates

function addEntry() {
  const newEntry = gatherFormData();
  let entries = JSON.parse(localStorage.getItem("checkEntries")) || [];
  entries.unshift(newEntry); // Add new entry to the top of the array
  localStorage.setItem("checkEntries", JSON.stringify(entries));
  updateTable();
  clearForm();
  logOperation("Create", `Added a new check: ${newEntry.checkName}`);
}

function updateEntry(index) {
  let entries = JSON.parse(localStorage.getItem("checkEntries"));
  const updatedEntry = gatherFormData();
  entries[index] = updatedEntry; // Update the existing entry
  localStorage.setItem("checkEntries", JSON.stringify(entries));
  updateTable();
  clearForm();
  logOperation("Update", `Updated check: ${updatedEntry.checkName}`);
}

function deleteEntry(index) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const entries = JSON.parse(localStorage.getItem("checkEntries"));
  const entryToDelete = entries[index];

  // Verify user authority
  if (
    entryToDelete.user === currentUser.username ||
    currentUser.role === "admin"
  ) {
    if (
      confirm(
        `Are you sure you want to delete this entry: ${entryToDelete.checkName}?`
      )
    ) {
      entries.splice(index, 1); // Remove the entry
      localStorage.setItem("checkEntries", JSON.stringify(entries));
      updateTable();
      logOperation("Delete", `Deleted check: ${entryToDelete.checkName}`);
      displayOperationMessage(`Deleted entry: ${entryToDelete.checkName}`);
    }
  } else {
    alert("You do not have permission to delete this entry.");
  }
}

function editEntry(index) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const entries = JSON.parse(localStorage.getItem("checkEntries"));
  const entry = entries[index];

  // Check if the current user created the entry or if they are an admin
  if (currentUser.role === "admin" || entry.user === currentUser.username) {
    if (
      confirm(`Are you sure you want to edit this entry: ${entry.checkName}?`)
    ) {
      loadFormData(entry);
      currentIndex = index; // Set the current index for updates
      document.getElementById("submitBtn").textContent = "Update Entry";
      document
        .getElementById("form-container")
        .scrollIntoView({ behavior: "smooth", block: "start" });
      displayOperationMessage(`Right now you are editing: ${entry.checkName}`);
    }
  } else {
    alert("You do not have permission to edit this entry.");
  }
}

function gatherFormData() {
  return {
    studentID: document.getElementById("studentID").value,
    checkName: document.getElementById("checkName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    checkNumber: document.getElementById("checkNumber").value,
    amount: parseFloat(document.getElementById("amount").value),
    insertDate: document.getElementById("insertDate").value,
    depositDate: document.getElementById("depositDate").value,
    checkStatus: document.getElementById("checkStatus").value,
    user: JSON.parse(localStorage.getItem("currentUser")).username,
  };
}

function loadFormData(data) {
  document.getElementById("studentID").value = data.studentID;
  document.getElementById("checkName").value = data.checkName;
  document.getElementById("phoneNumber").value = data.phoneNumber;
  document.getElementById("checkNumber").value = data.checkNumber;
  document.getElementById("amount").value = data.amount;
  document.getElementById("insertDate").value = data.insertDate;
  document.getElementById("depositDate").value = data.depositDate;
  document.getElementById("checkStatus").value = data.checkStatus;
}

function clearForm() {
  document.getElementById("checkEntryForm").reset();
  document.getElementById("submitBtn").textContent = "Add Check";
  currentIndex = -1; // Reset index after form clear
}

function updateTable() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const entries = JSON.parse(localStorage.getItem("checkEntries")) || [];
  const filteredEntries = entries.filter(
    (entry) =>
      entry.user === currentUser.username || currentUser.role === "admin"
  );
  fillTable(filteredEntries);
}

function fillTable(entries) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const tableBody = document
    .getElementById("entriesTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
  entries.forEach((entry, index) => {
    const row = tableBody.insertRow();
    Object.keys(entry).forEach((key) => {
      const cell = row.insertCell();
      cell.textContent = entry[key];
    });
    const actionsCell = row.insertCell();

    // Only show edit and delete buttons if the current user is the creator of the entry or is an admin
    if (entry.user === currentUser.username || currentUser.role === "admin") {
      actionsCell.innerHTML = `<button onclick="editEntry(${index})" class="edit-button">Edit</button> <button onclick="deleteEntry(${index})" class="delete-button">Delete</button>`;
    }
  });
  document.getElementById(
    "totalEntries"
  ).innerText = `Total Entries: ${entries.length}`;
}

function performSearch() {
  const filteredEntries = filterEntries();
  fillTable(filteredEntries);
}

function filterEntries() {
  const searchStudentID = document
    .getElementById("searchStudentID")
    .value.trim();
  const searchName = document
    .getElementById("searchName")
    .value.trim()
    .toLowerCase();
  const searchDepositDate = document.getElementById("searchDepositDate").value;
  const searchInsertDate = document.getElementById("searchInsertDate").value;
  const entries = JSON.parse(localStorage.getItem("checkEntries")) || [];
  return entries.filter((entry) => {
    return (
      (!searchStudentID || entry.studentID.includes(searchStudentID)) &&
      (!searchName || entry.checkName.toLowerCase().includes(searchName)) &&
      (!searchDepositDate || entry.depositDate === searchDepositDate) &&
      (!searchInsertDate || entry.insertDate === searchInsertDate)
    );
  });
}

function displayOperationMessage(message) {
  const messageDiv = document.getElementById("operationMessage");
  messageDiv.textContent = message;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000); // Message disappears after 3 seconds
}

function logOperation(operation, details) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // Allow logging for all users if it's a logout operation
  if (!currentUser && operation !== "Logout") {
    return; // Exit if no user is logged in, except for logging out operations
  }

  const logs = JSON.parse(localStorage.getItem("operationLogs")) || [];
  logs.push({
    date: new Date().toISOString(),
    user: currentUser ? currentUser.username : "Unknown", // Handle cases where the user might be null
    operation: operation,
    details: details,
  });
  localStorage.setItem("operationLogs", JSON.stringify(logs));
}

// Function to handle footer visibility on scroll
window.addEventListener("scroll", function () {
  const footer = document.querySelector("footer");
  let st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > 100) {
    // Adjust as per your specific needs
    footer.style.transform = "translateY(100%)";
    footer.style.transition = "transform 0.3s ease-in-out";
  } else {
    footer.style.transform = "translateY(0)";
  }
});
