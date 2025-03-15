/*****************************************************
 * US13 - Approve or Reject Leave Requests (Admin)
 *****************************************************/

// Mảng đơn nghỉ phép (pending + processed)
let pendingRequests = [
  {
    id: 1,
    teacherName: "Nguyễn Văn A",
    startDate: "2024-04-10",
    endDate: "2024-04-12",
    reason: "Nghỉ ốm",
    status: "Pending", // pending
  },
  {
    id: 2,
    teacherName: "Trần Thị B",
    startDate: "2024-05-01",
    endDate: "2024-05-05",
    reason: "Việc gia đình",
    status: "Pending",
  },
];

let processedRequests = [
  // Lưu các request đã duyệt/từ chối
  // {teacherName, dateRange, result, rejectReason}
];

// Tham chiếu các phần tử
const pendingRequestsBody = document.getElementById("pendingRequestsBody");
const processedRequestsBody = document.getElementById("processedRequestsBody");
const searchBox = document.getElementById("searchBox");

// Modal reject
const rejectRequestId = document.getElementById("rejectRequestId");
const rejectReason = document.getElementById("rejectReason");
const rejectError = document.getElementById("rejectError");

// Render bảng pending
function renderPendingRequests(list) {
  pendingRequestsBody.innerHTML = "";

  if (list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6">Không có đơn nào chờ xử lý</td>`;
    pendingRequestsBody.appendChild(tr);
    return;
  }

  list.forEach((req) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${req.teacherName}</td>
        <td>${req.startDate}</td>
        <td>${req.endDate}</td>
        <td>${req.reason}</td>
        <td>${req.status}</td>
        <td>
          <button 
            class="btn btn-sm btn-success" 
            onclick="approveRequest(${req.id})"
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
    pendingRequestsBody.appendChild(tr);
  });
}

// Render bảng processed
function renderProcessedRequests() {
  processedRequestsBody.innerHTML = "";

  if (processedRequests.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">Chưa có lịch sử xử lý</td>`;
    processedRequestsBody.appendChild(tr);
    return;
  }

  processedRequests.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${item.teacherName}</td>
        <td>${item.dateRange}</td>
        <td>${item.result}</td>
        <td>${item.rejectReason || ""}</td>
      `;
    processedRequestsBody.appendChild(tr);
  });
}

// Duyệt
function approveRequest(requestId) {
  const index = pendingRequests.findIndex((r) => r.id === requestId);
  if (index === -1) return;
  const req = pendingRequests[index];

  // Add vào processed
  processedRequests.push({
    teacherName: req.teacherName,
    dateRange: `${req.startDate} - ${req.endDate}`,
    result: "Đã duyệt",
    rejectReason: "", // ko có
  });

  // Remove khỏi pending
  pendingRequests.splice(index, 1);
  renderPendingRequests(pendingRequests);
  renderProcessedRequests();
}

// Mở modal từ chối
function openRejectModal(requestId) {
  rejectError.style.display = "none";
  rejectReason.value = "";
  rejectRequestId.value = requestId;
  $("#rejectModal").modal("show");
}

// Xác nhận từ chối
function confirmReject(e) {
  e.preventDefault();
  const id = parseInt(rejectRequestId.value, 10);
  const reason = rejectReason.value.trim();

  if (!reason) {
    rejectError.innerText = "Lý do từ chối không được bỏ trống";
    rejectError.style.display = "block";
    return;
  }

  const index = pendingRequests.findIndex((r) => r.id === id);
  if (index === -1) return;
  const req = pendingRequests[index];

  // Add vào processed
  processedRequests.push({
    teacherName: req.teacherName,
    dateRange: `${req.startDate} - ${req.endDate}`,
    result: "Đã từ chối",
    rejectReason: reason,
  });

  // Xoá khỏi pending
  pendingRequests.splice(index, 1);

  $("#rejectModal").modal("hide");
  renderPendingRequests(pendingRequests);
  renderProcessedRequests();
}

// Tìm kiếm
searchBox.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  const filtered = pendingRequests.filter(
    (r) =>
      r.teacherName.toLowerCase().includes(keyword) ||
      r.reason.toLowerCase().includes(keyword)
  );
  renderPendingRequests(filtered);
});

// Khi load
renderPendingRequests(pendingRequests);
renderProcessedRequests();
