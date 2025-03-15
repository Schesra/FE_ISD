/**********************************************************
 * US14 (hoặc 15) - Send Announcements to Teachers (Admin)
 **********************************************************/

// Mảng lưu các thông báo đã tạo
let announcements = [];

// Tham chiếu form
const announcementTitle = document.getElementById("announcementTitle");
const announcementBody = document.getElementById("announcementBody");
const recipientType = document.getElementById("recipientType");
const departmentSelect = document.getElementById("departmentSelect");
const scheduleDate = document.getElementById("scheduleDate");
const scheduleTime = document.getElementById("scheduleTime");
const errorMessage = document.getElementById("errorMessage");

// Bảng hiển thị
const announcementTableBody = document.getElementById("announcementTableBody");

// Toggle hiển thị department select
function toggleDepartmentSelect() {
  if (recipientType.value === "department") {
    document.getElementById("departmentSelectGroup").style.display = "block";
  } else {
    document.getElementById("departmentSelectGroup").style.display = "none";
  }
}

// Tạo/gửi thông báo
function createAnnouncement(e) {
  e.preventDefault();

  const titleVal = announcementTitle.value.trim();
  const bodyVal = announcementBody.value.trim();

  // Kiểm tra fields bắt buộc
  if (!titleVal || !bodyVal) {
    errorMessage.innerText =
      "Error: Title and message content are required fields.";
    errorMessage.style.display = "block";
    return;
  }
  errorMessage.style.display = "none";

  // Xác định người nhận
  let recipients = "";
  if (recipientType.value === "all") {
    recipients = "Tất cả giáo viên";
  } else {
    recipients = `Bộ môn: ${departmentSelect.value}`;
  }

  // Thời gian gửi (nếu trống => gửi ngay)
  let sendTime = "Gửi ngay";
  if (scheduleDate.value || scheduleTime.value) {
    // Tạo 1 chuỗi mô tả
    const dateStr = scheduleDate.value || "(chưa chọn ngày)";
    const timeStr = scheduleTime.value || "(chưa chọn giờ)";
    sendTime = `${dateStr} ${timeStr}`;
  }

  // Thêm vào mảng announcements
  announcements.push({
    title: titleVal,
    body: bodyVal,
    recipients,
    sendTime,
  });

  // Xoá form
  announcementTitle.value = "";
  announcementBody.value = "";
  recipientType.value = "all";
  departmentSelect.value = "Toán";
  toggleDepartmentSelect();
  scheduleDate.value = "";
  scheduleTime.value = "";

  // Render lại table
  renderAnnouncements();
}

// Render danh sách thông báo
function renderAnnouncements() {
  announcementTableBody.innerHTML = "";
  if (announcements.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">Chưa có thông báo nào</td>`;
    announcementTableBody.appendChild(tr);
    return;
  }

  announcements.forEach((ann) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ann.title}</td>
      <td>${ann.recipients}</td>
      <td>${ann.sendTime}</td>
      <td>${ann.body}</td>
    `;
    announcementTableBody.appendChild(tr);
  });
}

// Khi load
window.addEventListener("DOMContentLoaded", () => {
  // Lần đầu, hiển thị table (chưa có thông báo)
  renderAnnouncements();
});
