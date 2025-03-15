/*************************************************
 * US11 - Manage Employment Contracts (Admin)
 *************************************************/

// Mảng giả lập danh sách hợp đồng
let contracts = [
  {
    id: 1,
    teacherName: "Nguyễn Văn A",
    startDate: "2023-01-10",
    endDate: "2024-01-10",
    status: "Đang hiệu lực",
  },
  {
    id: 2,
    teacherName: "Trần Thị B",
    startDate: "2023-03-05",
    endDate: "2024-02-28",
    status: "Đang hiệu lực",
  },
  {
    id: 3,
    teacherName: "Phạm Thị C",
    startDate: "2022-05-01",
    endDate: "2023-12-01",
    status: "Đang hiệu lực",
  },
];

// Ngưỡng ngày để báo sắp hết hạn
const RENEWAL_THRESHOLD_DAYS = 30;

// Render danh sách
function renderContractsList() {
  const tableBody = document.getElementById("contractsTableBody");
  tableBody.innerHTML = "";

  contracts.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${c.teacherName}</td>
        <td>${c.startDate}</td>
        <td>${c.endDate}</td>
        <td>${c.status}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editContract(${c.id})">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="btn btn-sm btn-danger ml-2" onclick="deleteContract(${c.id})">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      `;
    tableBody.appendChild(tr);
  });
}

// Render hợp đồng sắp hết hạn
function renderUpcomingRenewals() {
  const upcomingBody = document.getElementById("upcomingContractsBody");
  const noMsg = document.getElementById("noUpcomingContractsMsg");
  upcomingBody.innerHTML = "";

  const today = new Date();
  const nearExpiring = contracts.filter((c) => {
    const end = new Date(c.endDate);
    const diffTime = end - today; // ms
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= RENEWAL_THRESHOLD_DAYS;
  });

  if (nearExpiring.length === 0) {
    noMsg.style.display = "block";
  } else {
    noMsg.style.display = "none";
    nearExpiring.forEach((c) => {
      const end = new Date(c.endDate);
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${c.teacherName}</td>
          <td>${c.startDate}</td>
          <td>${c.endDate}</td>
          <td>${diffDays} ngày</td>
          <td>${c.status}</td>
        `;
      upcomingBody.appendChild(tr);
    });
  }
}

// Thêm hợp đồng
function openAddContract() {
  document.getElementById("contractModalLabel").innerText = "Tạo Hợp đồng";
  document.getElementById("contractId").value = "";
  document.getElementById("teacherName").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("status").value = "Đang hiệu lực";
  document.getElementById("errorMessage").style.display = "none";
}

// Sửa hợp đồng
function editContract(id) {
  const contract = contracts.find((c) => c.id === id);
  if (!contract) return;

  document.getElementById("contractModalLabel").innerText = "Sửa Hợp đồng";
  document.getElementById("contractId").value = contract.id;
  document.getElementById("teacherName").value = contract.teacherName;
  document.getElementById("startDate").value = contract.startDate;
  document.getElementById("endDate").value = contract.endDate;
  document.getElementById("status").value = contract.status;
  document.getElementById("errorMessage").style.display = "none";

  $("#contractModal").modal("show");
}

// Xóa
function deleteContract(id) {
  contracts = contracts.filter((c) => c.id !== id);
  renderContractsList();
  renderUpcomingRenewals();
}

// Lưu
function saveContract(e) {
  e.preventDefault();
  const err = document.getElementById("errorMessage");
  const idVal = document.getElementById("contractId").value;
  const teacherName = document.getElementById("teacherName").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const status = document.getElementById("status").value;

  if (!teacherName || !startDate || !endDate) {
    err.innerText = "Error: Contract details are incomplete or missing.";
    err.style.display = "block";
    return;
  }

  if (idVal) {
    // Sửa
    const idNum = parseInt(idVal, 10);
    contracts = contracts.map((c) => {
      if (c.id === idNum) {
        return { ...c, teacherName, startDate, endDate, status };
      }
      return c;
    });
  } else {
    // Thêm
    const newId = contracts.length ? contracts[contracts.length - 1].id + 1 : 1;
    contracts.push({
      id: newId,
      teacherName,
      startDate,
      endDate,
      status,
    });
  }

  $("#contractModal").modal("hide");
  renderContractsList();
  renderUpcomingRenewals();
}

// Tìm kiếm
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = contracts.filter((c) =>
    c.teacherName.toLowerCase().includes(keyword)
  );
  const tableBody = document.getElementById("contractsTableBody");
  tableBody.innerHTML = "";

  filtered.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${c.teacherName}</td>
        <td>${c.startDate}</td>
        <td>${c.endDate}</td>
        <td>${c.status}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editContract(${c.id})">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="btn btn-sm btn-danger ml-2" onclick="deleteContract(${c.id})">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      `;
    tableBody.appendChild(tr);
  });
});

// Khi load
renderContractsList();
renderUpcomingRenewals();
