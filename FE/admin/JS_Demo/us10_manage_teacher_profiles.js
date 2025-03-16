/******************************************************
 * us10_manage_teacher_profiles.js - Mở rộng:
 * - Thêm viewTeacherDetail(id)
 * - Trong bảng, tên giáo viên là clickable => hiển thị modal chi tiết
 ******************************************************/

let teachers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    dateOfBirth: "1990-01-01",
    phone: "0123-456-789",
    email: "teacherA@example.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    emergencyContact: "Nguyễn Văn B - 0987-111-222",
    startDate: "2020-09-01",
    qualifications: "Thạc sĩ Toán",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    dateOfBirth: "1988-05-15",
    phone: "0989-000-111",
    email: "teacherB@example.com",
    address: "45 Đường XYZ, Quận 2, TP.HCM",
    emergencyContact: "Trần Văn C - 0999-222-333",
    startDate: "2019-05-20",
    qualifications: "Cử nhân Văn",
  },
];

// Tham chiếu DOM
const teacherTableBody = document.getElementById("teacherTableBody");
const errorMessage = document.getElementById("errorMessage");

// Modal Add/Edit input
const teacherIdInput = document.getElementById("teacherId");
const fullNameInput = document.getElementById("fullName");
const dateOfBirthInput = document.getElementById("dateOfBirth");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const emergencyContactInput = document.getElementById("emergencyContact");
const startDateInput = document.getElementById("startDate");
const qualificationsInput = document.getElementById("qualifications");

// Modal Detail (read-only)
const detailFullName = document.getElementById("detailFullName");
const detailDOB = document.getElementById("detailDOB");
const detailPhone = document.getElementById("detailPhone");
const detailEmail = document.getElementById("detailEmail");
const detailAddress = document.getElementById("detailAddress");
const detailEmergency = document.getElementById("detailEmergency");
const detailStartDate = document.getElementById("detailStartDate");
const detailQualifications = document.getElementById("detailQualifications");

// Render bảng
function renderTeacherList() {
  teacherTableBody.innerHTML = "";

  teachers.forEach((teacher) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <a href="#" onclick="viewTeacherDetail(${teacher.id})">
          ${teacher.fullName}
        </a>
      </td>
      <td>${teacher.dateOfBirth}</td>
      <td>${teacher.phone}</td>
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
    teacherTableBody.appendChild(row);
  });
}

// Xem chi tiết (read-only)
function viewTeacherDetail(id) {
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) return;

  detailFullName.textContent = teacher.fullName;
  detailDOB.textContent = teacher.dateOfBirth;
  detailPhone.textContent = teacher.phone;
  detailEmail.textContent = teacher.email;
  detailAddress.textContent = teacher.address;
  detailEmergency.textContent = teacher.emergencyContact;
  detailStartDate.textContent = teacher.startDate;
  detailQualifications.textContent = teacher.qualifications || "";

  // Hiển thị modal
  $("#teacherDetailModal").modal("show");
}

// Thêm giáo viên
function openAddTeacher() {
  document.getElementById("teacherModalLabel").innerText = "Thêm Giáo Viên";
  teacherIdInput.value = "";
  fullNameInput.value = "";
  dateOfBirthInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  emergencyContactInput.value = "";
  startDateInput.value = "";
  qualificationsInput.value = "";
  errorMessage.style.display = "none";
}

// Sửa
function editTeacher(id) {
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) return;

  document.getElementById("teacherModalLabel").innerText = "Sửa Giáo Viên";
  teacherIdInput.value = teacher.id;
  fullNameInput.value = teacher.fullName;
  dateOfBirthInput.value = teacher.dateOfBirth;
  phoneInput.value = teacher.phone;
  emailInput.value = teacher.email;
  addressInput.value = teacher.address;
  emergencyContactInput.value = teacher.emergencyContact;
  startDateInput.value = teacher.startDate;
  qualificationsInput.value = teacher.qualifications || "";
  errorMessage.style.display = "none";

  // Mở modal
  $("#teacherModal").modal("show");
}

// Xoá
function deleteTeacher(id) {
  teachers = teachers.filter((t) => t.id !== id);
  renderTeacherList();
}

// Lưu (thêm hoặc sửa)
function saveTeacher(e) {
  e.preventDefault();
  errorMessage.style.display = "none";
  errorMessage.textContent = "";

  const idVal = teacherIdInput.value;
  const fullNameVal = fullNameInput.value.trim();
  const dobVal = dateOfBirthInput.value;
  const phoneVal = phoneInput.value.trim();
  const emailVal = emailInput.value.trim();
  const addressVal = addressInput.value.trim();
  const emergVal = emergencyContactInput.value.trim();
  const startVal = startDateInput.value;
  const qualVal = qualificationsInput.value.trim();

  // Check bắt buộc
  if (
    !fullNameVal ||
    !dobVal ||
    !phoneVal ||
    !emailVal ||
    !addressVal ||
    !emergVal ||
    !startVal
  ) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "Vui lòng nhập đủ các trường bắt buộc.";
    return;
  }

  // Sửa
  if (idVal) {
    const idNumber = parseInt(idVal, 10);
    teachers = teachers.map((t) => {
      if (t.id === idNumber) {
        return {
          ...t,
          fullName: fullNameVal,
          dateOfBirth: dobVal,
          phone: phoneVal,
          email: emailVal,
          address: addressVal,
          emergencyContact: emergVal,
          startDate: startVal,
          qualifications: qualVal,
        };
      }
      return t;
    });
  } else {
    // Thêm
    const newId = teachers.length ? teachers[teachers.length - 1].id + 1 : 1;
    const newTeacher = {
      id: newId,
      fullName: fullNameVal,
      dateOfBirth: dobVal,
      phone: phoneVal,
      email: emailVal,
      address: addressVal,
      emergencyContact: emergVal,
      startDate: startVal,
      qualifications: qualVal,
    };
    teachers.push(newTeacher);
  }

  $("#teacherModal").modal("hide");
  renderTeacherList();
}

// Tìm kiếm
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  teacherTableBody.innerHTML = "";
  const filtered = teachers.filter((t) =>
    t.fullName.toLowerCase().includes(keyword)
  );
  filtered.forEach((teacher) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <a href="#" onclick="viewTeacherDetail(${teacher.id})">
          ${teacher.fullName}
        </a>
      </td>
      <td>${teacher.dateOfBirth}</td>
      <td>${teacher.phone}</td>
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
    teacherTableBody.appendChild(row);
  });
});

// Lần đầu load
renderTeacherList();
