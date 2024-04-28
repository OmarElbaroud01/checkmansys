document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    alert("You do not have the proper role to access the logs page.");
    window.location.href = "index.html"; // Redirect non-admin users
  } else {
    displayLogs();
  }
});

function displayLogs() {
  const logs = JSON.parse(localStorage.getItem("operationLogs")) || [];
  const logsContainer = document.getElementById("logsContainer");
  logsContainer.innerHTML = ""; // Clear previous log entries

  // Sort logs by date in descending order to show the newest first
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  logs.forEach((log) => {
    const row = createLogRow(log);
    logsContainer.appendChild(row); // Append each new row to the top of the container
  });
}

function createLogRow(log) {
  const row = document.createElement("tr");

  // Date/Time Column
  const dateCell = document.createElement("td");
  dateCell.textContent = formatLogDate(log.date);
  row.appendChild(dateCell);

  // User Column
  const userCell = document.createElement("td");
  userCell.textContent = log.user;
  row.appendChild(userCell);

  // Operation Column
  const operationCell = document.createElement("td");
  operationCell.textContent = log.operation;
  row.appendChild(operationCell);

  // Details Column
  const detailsCell = document.createElement("td");
  detailsCell.textContent = log.details;
  row.appendChild(detailsCell);

  return row;
}

function formatLogDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(); // Format the date to be more readable
}
