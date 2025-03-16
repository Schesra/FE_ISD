/***************************************************
 * us_create_teacher_account.js
 * Thay "Chọn giáo viên" = input text teacherName
 ***************************************************/

// Mảng lưu các tài khoản đã tạo
let teacherAccounts = [
  // { accountId, teacherName, username, createdAt }
];

const accountTableBody = document.getElementById("accountTableBody");
const errorBox = document.getElementById("errorBox");
const successBox = document.getElementById("successBox");

function createAccount(e) {
  e.preventDefault();
  errorBox.style.display = "none";
  successBox.style.display = "none";
  errorBox.textContent = "";
  successBox.textContent = "";

  const teacherNameVal = document.getElementById("teacherName").value.trim();
  const usernameVal = document.getElementById("username").value.trim();
  const passwordVal = document.getElementById("password").value.trim();

  if (!teacherNameVal || !usernameVal || !passwordVal) {
    errorBox.style.display = "block";
    errorBox.textContent = "Vui lòng nhập đủ các trường bắt buộc.";
    return;
  }

  // Kiểm tra trùng username
  if (teacherAccounts.find((acc) => acc.username === usernameVal)) {
    errorBox.style.display = "block";
    errorBox.textContent = "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.";
    return;
  }

  // Tạo account
  const newAccId = teacherAccounts.length
    ? teacherAccounts[teacherAccounts.length - 1].accountId + 1
    : 1;
  const now = new Date().toLocaleString();

  const newAccount = {
    accountId: newAccId,
    teacherName: teacherNameVal,
    username: usernameVal,
    createdAt: now,
  };
  teacherAccounts.push(newAccount);

  successBox.style.display = "block";
  successBox.innerHTML = `
      Đã tạo tài khoản cho giáo viên <strong>${teacherNameVal}</strong>.<br/>
      Tên đăng nhập: <strong>${usernameVal}</strong><br/>
      Mật khẩu tạm: <strong>${passwordVal}</strong>
    `;

  // Reset form
  document.getElementById("teacherName").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  renderAccountTable();
}

function renderAccountTable() {
  accountTableBody.innerHTML = "";
  teacherAccounts.forEach((acc) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${acc.accountId}</td>
        <td>${acc.teacherName}</td>
        <td>${acc.username}</td>
        <td>${acc.createdAt}</td>
      `;
    accountTableBody.appendChild(tr);
  });
}

// On load
document.addEventListener("DOMContentLoaded", renderAccountTable);
