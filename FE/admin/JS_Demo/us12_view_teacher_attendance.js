/***********************************************
 * US12 - View Teacher Attendance Records (Admin)
 ***********************************************/

// Dữ liệu chấm công mẫu (đã "verified")
const attendanceData = [
  {
    date: "2024-03-10",
    teacherName: "Nguyễn Văn A",
    department: "Toán",
    status: "Đúng giờ",
    time: "07:58",
  },
  {
    date: "2024-03-10",
    teacherName: "Trần Thị B",
    department: "Văn",
    status: "Đi muộn",
    time: "08:10",
  },
  {
    date: "2024-03-10",
    teacherName: "Phạm Văn C",
    department: "Anh",
    status: "Nghỉ",
    time: "--",
  },
  {
    date: "2024-03-09",
    teacherName: "Nguyễn Văn A",
    department: "Toán",
    status: "Đúng giờ",
    time: "07:55",
  },
  {
    date: "2024-03-09",
    teacherName: "Trần Thị B",
    department: "Văn",
    status: "Đúng giờ",
    time: "07:59",
  },
];

// Lấy tham chiếu các phần tử
const attendanceTableBody = document.getElementById("attendanceTableBody");
const filterTeacher = document.getElementById("filterTeacher");
const filterDepartment = document.getElementById("filterDepartment");
const filterDate = document.getElementById("filterDate");
const statPresent = document.getElementById("statPresent").querySelector("h4");
const statLate = document.getElementById("statLate").querySelector("h4");
const statAbsent = document.getElementById("statAbsent").querySelector("h4");

// Render dropdown Teacher & Department
function populateFilters() {
  // Lấy danh sách teacher, department unique
  const teachersSet = new Set();
  const deptSet = new Set();

  attendanceData.forEach((item) => {
    teachersSet.add(item.teacherName);
    deptSet.add(item.department);
  });

  // Render cho filterTeacher
  teachersSet.forEach((tName) => {
    const opt = document.createElement("option");
    opt.value = tName;
    opt.textContent = tName;
    filterTeacher.appendChild(opt);
  });

  // Render cho filterDepartment
  deptSet.forEach((dept) => {
    const opt = document.createElement("option");
    opt.value = dept;
    opt.textContent = dept;
    filterDepartment.appendChild(opt);
  });
}

// Hàm filter, hiển thị data
function applyFilters() {
  const tVal = filterTeacher.value; // teacherName
  const dVal = filterDepartment.value; // department
  const dateVal = filterDate.value; // 'YYYY-MM-DD'
  // Lọc
  let filtered = [...attendanceData];

  if (tVal) {
    filtered = filtered.filter((item) => item.teacherName === tVal);
  }
  if (dVal) {
    filtered = filtered.filter((item) => item.department === dVal);
  }
  if (dateVal) {
    filtered = filtered.filter((item) => item.date === dateVal);
  }

  // Render bảng
  renderAttendanceTable(filtered);
  // Tính thống kê
  updateStats(filtered);
}

// Render table
function renderAttendanceTable(dataArray) {
  attendanceTableBody.innerHTML = "";

  if (dataArray.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">Không có dữ liệu</td>`;
    attendanceTableBody.appendChild(tr);
    return;
  }

  dataArray.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${item.date}</td>
        <td>${item.teacherName}</td>
        <td>${item.department}</td>
        <td>${item.status}</td>
        <td>${item.time}</td>
      `;
    attendanceTableBody.appendChild(tr);
  });
}

// Tính & cập nhật thống kê (Dashboard)
function updateStats(dataArray) {
  let countPresent = 0; // Đúng giờ
  let countLate = 0; // Đi muộn
  let countAbsent = 0; // Nghỉ

  dataArray.forEach((item) => {
    if (item.status === "Đúng giờ") {
      countPresent++;
    } else if (item.status === "Đi muộn") {
      countLate++;
    } else if (item.status === "Nghỉ") {
      countAbsent++;
    }
  });

  // Gán vào h4
  statPresent.textContent = countPresent;
  statLate.textContent = countLate;
  statAbsent.textContent = countAbsent;
}

// Khi load
window.addEventListener("DOMContentLoaded", () => {
  // Tạo dropdown
  populateFilters();
  // Hiển thị tất cả
  renderAttendanceTable(attendanceData);
  updateStats(attendanceData);
});

// Tìm kiếm chung (trong cột Tên giáo viên, department...) – tuỳ nhu cầu
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", () => {
  const keyword = searchBox.value.toLowerCase().trim();
  // Tìm trong teacherName / department / status
  const results = attendanceData.filter(
    (item) =>
      item.teacherName.toLowerCase().includes(keyword) ||
      item.department.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword) ||
      item.date.includes(keyword)
  );
  // Render
  renderAttendanceTable(results);
  updateStats(results);
});
