/***************************************
 * US10_ManageTeacherProfiles (Admin)
 * Tách riêng JS logic
 ***************************************/

// Mảng mẫu danh sách giáo viên
let teachers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    dateOfBirth: "1990-01-01",
    contact: "0123-456-789",
    startDate: "2020-09-01",
    qualifications: "Thạc sĩ Toán",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    dateOfBirth: "1988-05-15",
    contact: "0123-999-888",
    startDate: "2019-05-20",
    qualifications: "Cử nhân Văn",
  },
];

// Hàm hiển thị danh sách giáo viên
function renderTeacherList() {
  const tableBody = document.getElementById("teacherTableBody");
  tableBody.innerHTML = "";

  teachers.forEach((teacher) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${teacher.fullName}</td>
        <td>${teacher.dateOfBirth}</td>
        <td>${teacher.contact}</td>
        <td>${teacher.startDate}</td>
        <td>${teacher.qualifications || ""}</td>
        <td>
          <button
            class="btn btn-sm btn-warning"
            onclick="editTeacher(${teacher.id})"
          >
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button
            class="btn btn-sm btn-danger ml-2"
            onclick="deleteTeacher(${teacher.id})"
          >
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      `;

    tableBody.appendChild(row);
  });
}

// Hàm mở modal ở chế độ thêm mới
function openAddTeacher() {
  document.getElementById("teacherModalLabel").innerText = "Thêm Giáo Viên";
  document.getElementById("teacherId").value = "";
  document.getElementById("fullName").value = "";
  document.getElementById("dateOfBirth").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("qualifications").value = "";
  document.getElementById("errorMessage").style.display = "none";
}

// Hàm sửa giáo viên
function editTeacher(id) {
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) return;

  document.getElementById("teacherModalLabel").innerText = "Sửa Giáo Viên";
  document.getElementById("teacherId").value = teacher.id;
  document.getElementById("fullName").value = teacher.fullName;
  document.getElementById("dateOfBirth").value = teacher.dateOfBirth;
  document.getElementById("contact").value = teacher.contact;
  document.getElementById("startDate").value = teacher.startDate;
  document.getElementById("qualifications").value = teacher.qualifications;
  document.getElementById("errorMessage").style.display = "none";

  // Mở modal Bootstrap
  $("#teacherModal").modal("show");
}

// Hàm xóa giáo viên
function deleteTeacher(id) {
  teachers = teachers.filter((t) => t.id !== id);
  renderTeacherList();
}

// Hàm lưu (thêm hoặc cập nhật) giáo viên
function saveTeacher(e) {
  e.preventDefault();
  const errorMsg = document.getElementById("errorMessage");

  const idValue = document.getElementById("teacherId").value;
  const fullName = document.getElementById("fullName").value.trim();
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const contact = document.getElementById("contact").value.trim();
  const startDate = document.getElementById("startDate").value;
  const qualifications = document.getElementById("qualifications").value.trim();

  // Kiểm tra validate
  if (!fullName || !contact) {
    errorMsg.innerText =
      "Error: Unable to save changes. Vui lòng kiểm tra thông tin bắt buộc.";
    errorMsg.style.display = "block";
    return;
  }

  if (idValue) {
    // Sửa
    const idNumber = parseInt(idValue);
    teachers = teachers.map((t) => {
      if (t.id === idNumber) {
        return {
          ...t,
          fullName,
          dateOfBirth,
          contact,
          startDate,
          qualifications,
        };
      }
      return t;
    });
  } else {
    // Thêm
    const newId = teachers.length ? teachers[teachers.length - 1].id + 1 : 1;
    const newTeacher = {
      id: newId,
      fullName,
      dateOfBirth,
      contact,
      startDate,
      qualifications,
    };
    teachers.push(newTeacher);
  }

  // Đóng modal và render lại
  $("#teacherModal").modal("hide");
  renderTeacherList();
}

// Hàm tìm kiếm giáo viên
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const tableBody = document.getElementById("teacherTableBody");
  tableBody.innerHTML = "";

  // Lọc
  const filtered = teachers.filter((t) =>
    t.fullName.toLowerCase().includes(keyword)
  );

  // Render danh sách đã lọc
  filtered.forEach((teacher) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${teacher.fullName}</td>
        <td>${teacher.dateOfBirth}</td>
        <td>${teacher.contact}</td>
        <td>${teacher.startDate}</td>
        <td>${teacher.qualifications || ""}</td>
        <td>
          <button
            class="btn btn-sm btn-warning"
            onclick="editTeacher(${teacher.id})"
          >
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button
            class="btn btn-sm btn-danger ml-2"
            onclick="deleteTeacher(${teacher.id})"
          >
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      `;
    tableBody.appendChild(row);
  });
});

// Render lần đầu khi load
renderTeacherList();
