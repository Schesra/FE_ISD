/***************************************************
 * admin_messenger_dropdown.js
 * Giao diện chat Admin - Teacher với dropdown
 ***************************************************/

// Danh sách giáo viên (mock data)
const teachers = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// Object chứa conversation cho từng teacher (key = teacher id)
const conversations = {
  1: [
    {
      sender: "teacher",
      message: "Chào admin, vui lòng kiểm tra thông báo mới.",
      time: "2024-03-10 08:00",
    },
    {
      sender: "admin",
      message: "Vâng, cảm ơn bạn. Admin sẽ kiểm tra ngay.",
      time: "2024-03-10 08:05",
    },
  ],
  2: [],
  3: [],
};

// Biến lưu teacher hiện tại
let currentTeacherId = null;

// Tham chiếu DOM
const teacherNameEl = document.getElementById("teacherName");
const teacherArrowEl = document.getElementById("teacherArrow");
const teacherListEl = document.getElementById("teacherList");
const chatContentEl = document.getElementById("chatContent");
const messageInputEl = document.getElementById("messageInput");

// Khi load
document.addEventListener("DOMContentLoaded", () => {
  renderTeacherList();
  // Toggle dropdown
  teacherArrowEl.addEventListener("click", toggleTeacherList);

  // Gửi tin khi nhấn Enter
  messageInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});

// Render danh sách teacher trong dropdown
function renderTeacherList() {
  teacherListEl.innerHTML = "";
  teachers.forEach((t) => {
    const div = document.createElement("div");
    div.className = "teacher-item";
    div.textContent = t.name;
    div.onclick = () => selectTeacher(t.id);
    teacherListEl.appendChild(div);
  });
}

// Chọn teacher => set currentTeacherId, render chat
function selectTeacher(teacherId) {
  currentTeacherId = teacherId;
  const teacherObj = teachers.find((t) => t.id === teacherId);
  teacherNameEl.textContent = teacherObj.name; // Cập nhật tiêu đề
  teacherListEl.style.display = "none"; // Ẩn dropdown
  renderConversation();
}

// Toggle hiển thị dropdown
function toggleTeacherList() {
  if (teacherListEl.style.display === "block") {
    teacherListEl.style.display = "none";
  } else {
    teacherListEl.style.display = "block";
  }
}

// Render conversation
function renderConversation() {
  chatContentEl.innerHTML = "";
  if (!currentTeacherId) return;
  const conv = conversations[currentTeacherId] || [];
  conv.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message " + msg.sender; // 'admin' or 'teacher'
    div.innerHTML = `
        <div>${msg.message}</div>
        <span class="timestamp">${msg.time}</span>
      `;
    chatContentEl.appendChild(div);
  });
  chatContentEl.scrollTop = chatContentEl.scrollHeight;
}

// Gửi tin nhắn
function sendMessage() {
  if (!currentTeacherId) return; // Chưa chọn teacher
  const text = messageInputEl.value.trim();
  if (!text) return;
  const now = new Date().toLocaleString();

  // Thêm tin nhắn admin
  if (!conversations[currentTeacherId]) {
    conversations[currentTeacherId] = [];
  }
  conversations[currentTeacherId].push({
    sender: "admin",
    message: text,
    time: now,
  });
  messageInputEl.value = "";
  renderConversation();

  // Giả lập teacher phản hồi sau 3 giây
  setTimeout(() => {
    const replyTime = new Date().toLocaleString();
    conversations[currentTeacherId].push({
      sender: "teacher",
      message: "Đã nhận tin nhắn từ admin.",
      time: replyTime,
    });
    renderConversation();
  }, 3000);
}
