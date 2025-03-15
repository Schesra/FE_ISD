/***********************************************************
 * US16 - Manage Teacher Transfers (Admin)
 ***********************************************************/

// Mảng pending requests (giả lập)
let pendingTransfers = [
  {
    id: 1,
    teacherName: "Nguyễn Văn A",
    currentAssignment: "Trường THPT A - Bộ môn Toán",
    desiredAssignment: "Trường THPT B - Bộ môn Toán",
    reason: "Gần nhà hơn",
    status: "Pending",
  },
  {
    id: 2,
    teacherName: "Trần Thị B",
    currentAssignment: "Trường THPT A - Bộ môn Văn",
    desiredAssignment: "Trường THPT C - Bộ môn Văn",
    reason: "Gần chồng con",
    status: "Pending",
  },
];

// Mảng đã xử lý
let processedTransfers = [
  // {teacherName, assignment, result, rejectReason}
];

// Tham chiếu DOM
const pendingTransfersBody = document.getElementById("pendingTransfersBody");
const processedTransfersBody = document.getElementById(
  "processedTransfersBody"
);
const searchInput = document.getElementById("searchInput");

const rejectTransferId = document.getElementById("rejectTransferId");
const rejectReason = document.getElementById("rejectReason");
const rejectError = document.getElementById("rejectError");

// Render Pending
function renderPendingTransfers(list) {
  pendingTransfersBody.innerHTML = "";

  if (list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6">Không có yêu cầu chờ xử lý</td>`;
    pendingTransfersBody.appendChild(tr);
    return;
  }

  list.forEach((req) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${req.teacherName}</td>
        <td>${req.currentAssignment}</td>
        <td>${req.desiredAssignment}</td>
        <td>${req.reason}</td>
        <td>${req.status}</td>
        <td>
          <button 
            class="btn btn-sm btn-success" 
            onclick="approveTransfer(${req.id})"
          >
            Duyệt
          </button>
          <button 
            class="btn btn-sm btn-danger ml-2"
            onclick="openRejectModal(${req.id})"
          >
            Từ Chối
          </button>
        </td>
      `;
    pendingTransfersBody.appendChild(tr);
  });
}

// Render Processed
function renderProcessedTransfers() {
  processedTransfersBody.innerHTML = "";

  if (processedTransfers.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">Chưa có lịch sử chuyển công tác</td>`;
    processedTransfersBody.appendChild(tr);
    return;
  }

  processedTransfers.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${item.teacherName}</td>
        <td>${item.assignment}</td>
        <td>${item.result}</td>
        <td>${item.rejectReason || ""}</td>
      `;
    processedTransfersBody.appendChild(tr);
  });
}

// Duyệt
function approveTransfer(transferId) {
  try {
    const idx = pendingTransfers.findIndex((t) => t.id === transferId);
    if (idx === -1) throw new Error("Not found");

    const req = pendingTransfers[idx];

    // Chuyển sang processed
    processedTransfers.push({
      teacherName: req.teacherName,
      assignment: `${req.currentAssignment} => ${req.desiredAssignment}`,
      result: "Đã duyệt",
      rejectReason: "",
    });

    // Loại khỏi pending
    pendingTransfers.splice(idx, 1);

    // Giả lập "update teacher schedules automatically"

    // Render lại
    renderPendingTransfers(pendingTransfers);
    renderProcessedTransfers();
  } catch (err) {
    alert("Error: Unable to process transfer request at this time.");
  }
}

// Mở modal từ chối
function openRejectModal(transferId) {
  rejectError.style.display = "none";
  rejectReason.value = "";
  rejectTransferId.value = transferId;
  $("#rejectModal").modal("show");
}

// Xác nhận từ chối
function confirmReject(e) {
  e.preventDefault();
  const id = parseInt(rejectTransferId.value, 10);
  const reasonVal = rejectReason.value.trim();

  if (!reasonVal) {
    rejectError.innerText = "Lý do từ chối không được bỏ trống";
    rejectError.style.display = "block";
    return;
  }

  try {
    const idx = pendingTransfers.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Not found");

    const req = pendingTransfers[idx];

    processedTransfers.push({
      teacherName: req.teacherName,
      assignment: `${req.currentAssignment} => ${req.desiredAssignment}`,
      result: "Đã từ chối",
      rejectReason: reasonVal,
    });

    pendingTransfers.splice(idx, 1);
    $("#rejectModal").modal("hide");

    renderPendingTransfers(pendingTransfers);
    renderProcessedTransfers();
  } catch (err) {
    alert("Error: Unable to process transfer request at this time.");
  }
}

// Tìm kiếm
searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  const filtered = pendingTransfers.filter(
    (req) =>
      req.teacherName.toLowerCase().includes(keyword) ||
      req.currentAssignment.toLowerCase().includes(keyword) ||
      req.desiredAssignment.toLowerCase().includes(keyword) ||
      req.reason.toLowerCase().includes(keyword)
  );
  renderPendingTransfers(filtered);
});

// Khi load
renderPendingTransfers(pendingTransfers);
renderProcessedTransfers();
