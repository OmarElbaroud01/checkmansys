document.addEventListener("DOMContentLoaded", function () {
  loadTableData();
});

function loadTableData() {
  // Example data; replace with actual fetching from storage or server
  const data = JSON.parse(localStorage.getItem("checkEntries")) || [];
  updateTable(data);
}

function applyFilters() {
  const depositDate = document.getElementById("filterByDepositDate").value;
  const insertDate = document.getElementById("filterByInsertDate").value;
  const allData = JSON.parse(localStorage.getItem("checkEntries")) || [];
  const filteredData = allData.filter((item) => {
    return (
      (!depositDate || item.depositDate === depositDate) &&
      (!insertDate || item.insertDate === insertDate)
    );
  });
  updateTable(filteredData);
}

function updateTable(data) {
  const tbody = document.getElementById("exportTable").querySelector("tbody");
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    let row = tbody.insertRow();
    let checkboxCell = row.insertCell();
    checkboxCell.innerHTML = `<input type="checkbox" class="selectRow" data-index="${index}">`;

    let rowData = [
      item.checkName,
      item.phoneNumber,
      item.checkNumber,
      item.amount,
      item.depositDate,
    ];
    rowData.forEach((text) => {
      let cell = row.insertCell();
      cell.textContent = text;
    });
  });

  updateDataCount(data.length);
  document.getElementById("noDataMessage").style.display = data.length
    ? "none"
    : "block";
}

function updateDataCount(count) {
  document.getElementById("dataCount").textContent = `Showing ${count} entries`;
}

function toggleAllCheckboxes(source) {
  document.querySelectorAll(".selectRow").forEach((checkbox) => {
    checkbox.checked = source.checked;
  });
}

function collectSelectedData() {
  const checkboxes = document.querySelectorAll(".selectRow:checked");
  const allData = JSON.parse(localStorage.getItem("checkEntries")) || [];
  return Array.from(checkboxes).map(
    (checkbox) => allData[checkbox.dataset.index]
  );
}

function exportToCSV() {
  const data = collectSelectedData();
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Check Name,Phone Number,Check Number,Amount,Deposit Date\n";
  data.forEach(function (item) {
    const row = [
      item.checkName,
      item.phoneNumber,
      item.checkNumber,
      item.amount,
      item.depositDate,
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "exported_data.csv");
  document.body.appendChild(link);
  link.click();
}

function exportToPDF() {
  const data = collectSelectedData();
  let pdfContent = `<html><head><title>Exported Data</title></head><body style="font-family: Arial; font-size: 10pt;"><table border="1" cellspacing="0" cellpadding="5"><tr><th>Check Name</th><th>Phone Number</th><th>Check Number</th><th>Amount</th><th>Deposit Date</th></tr>`;
  data.forEach((item) => {
    pdfContent += `<tr><td>${item.checkName}</td><td>${item.phoneNumber}</td><td>${item.checkNumber}</td><td>${item.amount}</td><td>${item.depositDate}</td></tr>`;
  });
  pdfContent += `</table></body></html>`;
  const win = window.open("");
  win.document.write(pdfContent);
  win.document.close();
  win.print();
}
