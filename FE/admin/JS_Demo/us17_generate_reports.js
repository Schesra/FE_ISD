/********************************************************
 * US17 - Generate Administrative Reports (Admin)
 ********************************************************/

const errorMessage = document.getElementById("errorMessage");
const reportContainer = document.getElementById("reportContainer");
const reportContent = document.getElementById("reportContent");

// Tạo báo cáo
function generateReport(e) {
  e.preventDefault();
  errorMessage.style.display = "none";

  const type = document.getElementById("reportType").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  // Kiểm tra input
  if (!type) {
    errorMessage.innerText =
      "Error: No data available for the selected report type.";
    errorMessage.style.display = "block";
    return;
  }
  // Giả sử optional date, tuỳ ý:
  // if (!start || !end) { ... } => tuỳ logic

  // Giả lập check data availability
  // (Trong thực tế, gọi API, nếu empty => hiển thị error)
  const hasData = mockCheckData(type, start, end);
  if (!hasData) {
    errorMessage.innerText =
      "Error: No data available for the selected report type.";
    errorMessage.style.display = "block";
    reportContainer.style.display = "none";
    return;
  }

  // Giả lập tạo nội dung báo cáo
  const html = mockGenerateHTML(type, start, end);
  reportContent.innerHTML = html;

  // Hiển thị container
  reportContainer.style.display = "block";
}

// Xuất PDF (demo)
function exportPDF() {
  // Lấy nội dung HTML
  const content = reportContent.innerHTML;
  // Dùng jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");

  // Giả lập convert HTML -> PDF text
  // Rất đơn giản: doc.text( 'Nội dung', x, y )
  // hoặc doc.html() (jsPDF 2.5+)
  doc.html(content, {
    callback: function (doc) {
      doc.save("report.pdf");
    },
    x: 10,
    y: 10,
  });
}

// Xuất Excel (demo)
function exportExcel() {
  // Tạo workbook
  let wb = XLSX.utils.book_new();
  // Giả lập 2 cột data
  let data = [
    ["Tên", "Giá trị"],
    ["Loại báo cáo", document.getElementById("reportType").value],
    [
      "Thời gian",
      document.getElementById("startDate").value +
        " - " +
        document.getElementById("endDate").value,
    ],
    // ...
  ];
  let ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, "report.xlsx");
}

/* Giả lập check data => true/false */
function mockCheckData(type, start, end) {
  // Tùy logic, ví dụ random
  const randomVal = Math.random();
  if (randomVal < 0.2) {
    return false; // 20% no data
  }
  return true;
}

/* Giả lập tạo nội dung HTML báo cáo */
function mockGenerateHTML(type, start, end) {
  let title = "";
  if (type === "attendance") {
    title = "Báo cáo Điểm Danh";
  } else if (type === "leave") {
    title = "Báo cáo Nghỉ Phép";
  } else {
    title = "Báo cáo Phân Bổ Nhân Sự";
  }
  let dateRange = `Từ: ${start || "N/A"} - Đến: ${end || "N/A"}`;

  // Tạo 1 HTML mô phỏng
  return `
    <h3>${title}</h3>
    <p>${dateRange}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
       Curabitur vel sem vel lacus vulputate aliquam...</p>
    <ul>
      <li>Dữ liệu 1</li>
      <li>Dữ liệu 2</li>
      <li>Dữ liệu 3</li>
    </ul>
  `;
}
