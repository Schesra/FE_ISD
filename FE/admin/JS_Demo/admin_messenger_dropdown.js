/***************************************************
 * admin_messenger_dropdown.js
 * Giao diện chat Admin - Teacher với dropdown
 ***************************************************/

// Danh sách giáo viên (mock)
const teachers = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// Lưu conversation cho từng teacher
const conversations = {
  1: [
    {
      sender: "teacher",
      message: "Chào admin, em có thắc mắc về lịch dạy.",
      time: "2024-03-10 08:00",
    },
    {
      sender: "admin",
      message: "Chào Nguyễn Văn A, admin có thể giúp gì?",
      time: "2024-03-10 08:05",
    },
  ],
  2: [],
  3: [],
};

let currentTeacherId = null;

// Tham chiếu
const teacherNameEl = document.getElementById("teacherName");
const teacherArrow = document.getElementById("teacherArrow");
const teacherListEl = document.getElementById("teacherList");
const chatContentEl = document.getElementById("chatContent");
const messageInputEl = document.getElementById("messageInput");

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  renderTeacherList();
  // Ẩn/hiện dropdown khi click mũi tên
  teacherArrow.addEventListener("click", toggleTeacherList);

  // Gửi tin nhắn khi nhấn Enter
  messageInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});

// Render danh sách teachers trong dropdown
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

// Chọn teacher => cập nhật currentTeacherId, hiển thị chat
function selectTeacher(teacherId) {
  currentTeacherId = teacherId;
  const teacherObj = teachers.find((t) => t.id === teacherId);
  teacherNameEl.textContent = teacherObj.name;
  teacherListEl.style.display = "none"; // Ẩn dropdown
  renderConversation();
}

// Toggle hiển thị/ẩn dropdown teacherList
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
    div.className = "message " + msg.sender;
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

  // Giả lập teacher phản hồi sau 3s
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
