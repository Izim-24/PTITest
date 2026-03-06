// ===== ADMIN DASHBOARD FUNCTIONALITY =====

// Mock data for testing
const mockExams = [
    { id: 1, title: "Thi Giữa kỳ - Lập trình Web", type: "Định kỳ", status: "Đang mở", questions: 20, duration: "45 phút" },
    { id: 2, title: "Thi Luyện tập - Database", type: "Tự do", status: "Đang mở", questions: 30, duration: "60 phút" },
    { id: 3, title: "Thi Cuối kỳ - OOP", type: "Định kỳ", status: "Đã đóng", questions: 25, duration: "90 phút" }
];

const mockUsers = [
    { id: 1, username: "Nguyễn Văn A", email: "vana@ptit.edu.vn", role: "Sinh viên", registeredDate: "2026-03-01", status: "Hoạt động" },
    { id: 2, username: "Trần Thị B", email: "tranb@ptit.edu.vn", role: "Sinh viên", registeredDate: "2026-03-02", status: "Hoạt động" },
    { id: 3, username: "Lê Văn C", email: "levanc@ptit.edu.vn", role: "Sinh viên", registeredDate: "2026-03-03", status: "Không hoạt động" }
];

const mockResults = [
    { id: 1, student: "Nguyễn Văn A", score: 9.0, correct: "18/20", time: "35 phút", date: "2026-03-04" },
    { id: 2, student: "Trần Thị B", score: 7.5, correct: "15/20", time: "40 phút", date: "2026-03-04" },
    { id: 3, student: "Lê Văn C", score: 8.5, correct: "17/20", time: "38 phút", date: "2026-03-03" }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check admin login at dashboard
    if (document.getElementById('dashboardPage')) {
        checkAdminLogin();
        initDashboard();
    } else {
        // Admin login page
        initAdminLogin();
    }
});

// Check if admin is logged in
function checkAdminLogin() {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
        window.location.href = 'login.html';
        return;
    }
    
    const admin = JSON.parse(adminSession);
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) {
        adminNameEl.textContent = admin.username || 'Admin';
    }
}

// Initialize dashboard
function initDashboard() {
    initializeNavigation();
    initializeLogout();
    initializeSearch();
    loadDashboardData();
    setupEventListeners();
}

// Initialize admin login form
function initAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');
        const loginMessage = document.getElementById('loginMessage');
        
        // Reset errors
        usernameError.textContent = '';
        passwordError.textContent = '';
        loginMessage.className = 'login-message';
        
        let isValid = true;
        
        // Validate
        if (!username) {
            usernameError.textContent = 'Vui lòng nhập tên đăng nhập';
            isValid = false;
        }
        
        if (!password) {
            passwordError.textContent = 'Vui lòng nhập mật khẩu';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check credentials (demo: admin/admin123)
        if (username === 'admin' && password === 'admin123') {
            loginMessage.className = 'login-message success';
            loginMessage.textContent = 'Đăng nhập thành công!';
            
            // Store admin session
            localStorage.setItem('adminSession', JSON.stringify({
                username: username,
                loginTime: new Date().toISOString()
            }));
            
            // Redirect
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            loginMessage.className = 'login-message error';
            loginMessage.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
        }
    });
}

// Initialize sidebar navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const page = this.getAttribute('data-page');
            showPage(page);
            loadPageData(page);
        });
    });
}

// Show page content
function showPage(page) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(p => p.classList.remove('active'));
    
    let pageEl = document.getElementById(page + 'Page');
    if (pageEl) {
        pageEl.classList.add('active');
    }
    
    const pageTitle = document.getElementById('pageTitle');
    const pageNames = {
        'dashboard': 'Dashboard',
        'exams': 'Quản lý Kỳ thi',
        'users': 'Quản lý Người dùng',
        'results': 'Thống kê Kết quả',
        'student-results': 'Kết quả Sinh viên'
    };
    
    if (pageTitle) {
        pageTitle.textContent = pageNames[page] || 'Dashboard';
    }
}

// Load page specific data
function loadPageData(page) {
    switch(page) {
        case 'exams': loadExamsTable(); break;
        case 'users': loadUsersTable(); break;
        case 'results': loadResultsTable(); break;
        case 'student-results': loadStudentResults(); break;
    }
}

// Load dashboard data
function loadDashboardData() {
    document.getElementById('totalUsers').textContent = mockUsers.length;
    document.getElementById('totalExams').textContent = mockExams.length;
    document.getElementById('completedAttempts').textContent = mockResults.length;
    document.getElementById('inProgressAttempts').textContent = '12';
    
    // Load exam stats
    const examStatsBody = document.getElementById('examStatsBody');
    examStatsBody.innerHTML = mockExams.map(exam => `
        <tr>
            <td>${exam.title}</td>
            <td>${Math.floor(Math.random() * 30) + 10}</td>
            <td>${(Math.random() * 3 + 6).toFixed(1)}</td>
            <td><span class="badge badge-success">${Math.floor(Math.random() * 30) + 70}%</span></td>
        </tr>
    `).join('');
}

// Load exams table
function loadExamsTable() {
    const tbody = document.getElementById('examsTableBody');
    tbody.innerHTML = mockExams.map((exam, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${exam.title}</td>
            <td><span class="badge badge-info">${exam.type}</span></td>
            <td><span class="badge ${exam.status === 'Đang mở' ? 'badge-success' : 'badge-danger'}">${exam.status}</span></td>
            <td>${exam.questions}</td>
            <td>${exam.duration}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editExam(${exam.id})">✏️</button>
                <button class="btn btn-sm btn-delete" onclick="deleteExam(${exam.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Load users table
function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = mockUsers.map((user, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-info">${user.role}</span></td>
            <td>${user.registeredDate}</td>
            <td><span class="badge ${user.status === 'Hoạt động' ? 'badge-success' : 'badge-danger'}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editUser(${user.id})">✏️</button>
                <button class="btn btn-sm btn-delete" onclick="deleteUser(${user.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Load results table
function loadResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = mockResults.map((result, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${result.student}</td>
            <td><strong>${result.score}</strong></td>
            <td>${result.correct}</td>
            <td>${result.time}</td>
            <td>${result.date}</td>
        </tr>
    `).join('');
}

// Load student results
function loadStudentResults() {
    const tbody = document.getElementById('studentDetailsBody');
    tbody.innerHTML = mockUsers.map((user, i) => `
        <tr>
            <td>SV${String(i+1).padStart(3, '0')}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${Math.floor(Math.random() * 4) + 1}</td>
            <td>${(Math.random() * 3 + 6).toFixed(1)}</td>
            <td><button class="btn btn-sm btn-primary" onclick="viewStudentDetail(${user.id})">Xem</button></td>
        </tr>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Add exam button
    const addExamBtn = document.getElementById('addExamBtn');
    if (addExamBtn) {
        addExamBtn.addEventListener('click', function() {
            alert('Thêm kỳ thi mới');
        });
    }
    
    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            alert('Thêm người dùng mới');
        });
    }
}

// Initialize logout
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('adminSession');
                window.location.href = 'login.html';
            }
        });
    }
}

// Initialize search
function initializeSearch() {
    const examSearch = document.getElementById('examSearch');
    if (examSearch) {
        examSearch.addEventListener('input', function() {
            filterTable('examsTableBody', this.value, mockExams);
        });
    }
    
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            filterTable('usersTableBody', this.value, mockUsers);
        });
    }
    
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', function() {
            filterTable('studentDetailsBody', this.value, mockUsers);
        });
    }
}

// Filter table
function filterTable(tableBodyId, searchTerm) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    const term = searchTerm.toLowerCase().trim();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Edit exam
function editExam(id) {
    const exam = mockExams.find(e => e.id === id);
    if (exam) {
        openExamEditor('edit', exam);
    }
}

// Delete exam
function deleteExam(id) {
    if (confirm('Bạn chắc chắn muốn xóa kỳ thi này?')) {
        const index = mockExams.findIndex(e => e.id === id);
        if (index > -1) {
            mockExams.splice(index, 1);
            loadExamsTable();
            alert('Xóa kỳ thi thành công!');
        }
    }
}

// Edit user
function editUser(id) {
    alert('Chỉnh sửa người dùng ID: ' + id);
}

// Delete user
function deleteUser(id) {
    if (confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
        alert('Xóa người dùng ID: ' + id);
        loadUsersTable();
    }
}

// View student detail
function viewStudentDetail(id) {
    alert('Xem chi tiết sinh viên ID: ' + id);
}

// ===== EXAM EDITOR FUNCTIONALITY =====

// Global variable to store current questions
let currentQuestions = [];
let editingExamId = null;

// Open exam editor modal
function openExamEditor(mode = 'add', exam = null) {
    const modal = document.getElementById('examEditorModal');
    const modalTitle = document.getElementById('modalTitle');
    const existingForm = document.getElementById('examForm');
    
    if (mode === 'add') {
        modalTitle.textContent = 'Thêm Kỳ thi Mới';
        document.getElementById('examName').value = '';
        document.getElementById('examType').value = '';
        document.getElementById('examDuration').value = '';
        document.getElementById('examScore').value = '10';
        document.getElementById('examDescription').value = '';
        currentQuestions = [];
        editingExamId = null;
    } else if (mode === 'edit' && exam) {
        modalTitle.textContent = 'Chỉnh sửa Kỳ thi';
        document.getElementById('examName').value = exam.title || '';
        document.getElementById('examType').value = exam.type || '';
        document.getElementById('examDuration').value = exam.duration.replace(' phút', '') || '';
        document.getElementById('examScore').value = '10';
        document.getElementById('examDescription').value = exam.description || '';
        currentQuestions = exam.questions || [];
        editingExamId = exam.id;
    }
    
    renderQuestions();
    modal.classList.remove('hidden');
}

// Close exam editor modal
function closeExamEditor() {
    document.getElementById('examEditorModal').classList.add('hidden');
    currentQuestions = [];
    editingExamId = null;
}

// Close excel template modal
function closeExcelTemplate() {
    document.getElementById('excelTemplateModal').classList.add('hidden');
}

// Render questions list
function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';
    
    if (currentQuestions.length === 0) {
        questionsList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Chưa có câu hỏi nào. Hãy thêm câu hỏi mới.</p>';
        return;
    }
    
    currentQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        let optionsHtml = '';
        if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
                optionsHtml += `<span class="badge">${option.id.toUpperCase()}</span> ${option.text}<br>`;
            });
        }
        
        const correctAnswerText = question.correctAnswer ? question.correctAnswer.toUpperCase() : '?';
        
        questionDiv.innerHTML = `
            <div class="question-item-header">
                <span class="question-number">Câu ${index + 1}</span>
                <div class="question-actions">
                    <button type="button" class="btn btn-sm btn-edit" onclick="editQuestion(${index})">✏️</button>
                    <button type="button" class="btn btn-sm btn-delete" onclick="deleteQuestion(${index})">🗑️</button>
                </div>
            </div>
            <div class="question-item-body">
                <div class="question-text">${question.question || 'Chưa có nội dung'}</div>
                <div class="options-grid">
                    ${optionsHtml}
                </div>
                <div class="correct-answer">
                    <strong>Đáp án đúng:</strong> <span style="color: var(--ptit-red); font-weight: 600;">${correctAnswerText}</span>
                </div>
            </div>
        `;
        
        questionsList.appendChild(questionDiv);
    });
}

// Add new question
function addQuestion() {
    const newQuestion = {
        id: currentQuestions.length + 1,
        question: 'Nhập câu hỏi mới',
        options: [
            { id: 'a', text: 'Đáp án A' },
            { id: 'b', text: 'Đáp án B' },
            { id: 'c', text: 'Đáp án C' },
            { id: 'd', text: 'Đáp án D' }
        ],
        correctAnswer: 'a'
    };
    
    currentQuestions.push(newQuestion);
    renderQuestions();
}

// Edit question
function editQuestion(index) {
    const question = currentQuestions[index];
    
    const questionText = prompt('Nhập câu hỏi:', question.question);
    if (questionText === null) return;
    
    question.question = questionText;
    
    for (let i = 0; i < 4; i++) {
        const optionText = prompt(`Nhập đáp án ${String.fromCharCode(65 + i)}:`, question.options[i].text);
        if (optionText !== null) {
            question.options[i].text = optionText;
        }
    }
    
    const correctAnswer = prompt('Nhập đáp án đúng (a/b/c/d):', question.correctAnswer);
    if (correctAnswer && ['a', 'b', 'c', 'd'].includes(correctAnswer.toLowerCase())) {
        question.correctAnswer = correctAnswer.toLowerCase();
    }
    
    renderQuestions();
}

// Delete question
function deleteQuestion(index) {
    if (confirm('Bạn chắc chắn muốn xóa câu hỏi này?')) {
        currentQuestions.splice(index, 1);
        renderQuestions();
    }
}

// Toggle Excel import section
function toggleExcelImport() {
    const section = document.getElementById('excelImportSection');
    section.classList.toggle('hidden');
}

// Import questions from Excel
function importQuestionsFromExcel() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Vui lòng chọn file Excel');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            currentQuestions = [];
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row[0]) continue;
                
                const question = {
                    id: i,
                    question: row[0],
                    options: [
                        { id: 'a', text: row[1] || 'Đáp án A' },
                        { id: 'b', text: row[2] || 'Đáp án B' },
                        { id: 'c', text: row[3] || 'Đáp án C' },
                        { id: 'd', text: row[4] || 'Đáp án D' }
                    ],
                    correctAnswer: (row[5] || 'a').toLowerCase()
                };
                currentQuestions.push(question);
            }
            
            alert(`Nhập thành công ${currentQuestions.length} câu hỏi từ file Excel`);
            renderQuestions();
            toggleExcelImport();
            fileInput.value = '';
        } catch (error) {
            alert('Lỗi khi xử lý file Excel: ' + error.message);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Download Excel template
function downloadExcelTemplate() {
    const data = [
        ['Câu hỏi', 'Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D', 'Đáp án đúng'],
        ['Ví dụ: 1 + 1 = ?', '1', '2', '3', '4', 'b'],
        ['Ví dụ: Thủ đô Việt Nam là?', 'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'a']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Câu hỏi');
    XLSX.writeFile(wb, 'template_questions.xlsx');
}

// Setup exam form submission
function setupExamFormSubmission() {
    const examForm = document.getElementById('examForm');
    if (!examForm) return;
    
    examForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('examName').value.trim();
        const type = document.getElementById('examType').value;
        const duration = document.getElementById('examDuration').value;
        const description = document.getElementById('examDescription').value.trim();
        
        if (!name || !type || !duration) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        if (currentQuestions.length === 0) {
            alert('Vui lòng thêm ít nhất 1 câu hỏi');
            return;
        }
        
        if (editingExamId) {
            // Update existing exam
            const exam = mockExams.find(e => e.id === editingExamId);
            if (exam) {
                exam.title = name;
                exam.type = type;
                exam.duration = duration + ' phút';
                exam.description = description;
                exam.questions = currentQuestions.length;
                alert('Cập nhật kỳ thi thành công!');
            }
        } else {
            // Add new exam
            const newExam = {
                id: mockExams.length + 1,
                title: name,
                type: type,
                status: 'Đang mở',
                questions: currentQuestions.length,
                duration: duration + ' phút',
                description: description,
                questionData: currentQuestions
            };
            mockExams.push(newExam);
            alert('Thêm kỳ thi thành công!');
        }
        
        closeExamEditor();
        loadExamsTable();
    });
}

// ===== EXPORT FUNCTIONALITY =====

// Export results to PDF
function exportResultsToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text('Báo Cáo Kết Quả Thi', 14, 15);
    
    // Info
    doc.setFontSize(10);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 14, 25);
    
    // Table headers
    const headers = ['Thứ tự', 'Sinh viên', 'Điểm', 'Câu Đúng', 'Thời gian', 'Ngày Tham gia'];
    const rows = mockResults.map((result, idx) => [
        idx + 1,
        result.student,
        result.score,
        result.correct,
        result.time,
        result.date
    ]);
    
    // Add table
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 35,
        headStyles: { fillColor: [153, 0, 0], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Statistics
    const avgScore = (mockResults.reduce((sum, r) => sum + r.score, 0) / mockResults.length).toFixed(2);
    doc.text(`Điểm trung bình: ${avgScore}`, 14, doc.lastAutoTable.finalY + 15);
    doc.text(`Tổng lần tham gia: ${mockResults.length}`, 14, doc.lastAutoTable.finalY + 25);
    
    // Save
    doc.save('results_report.pdf');
    alert('Xuất PDF thành công!');
}

// Export results to Excel
function exportResultsToExcel() {
    const data = [
        ['Báo Cáo Kết Quả Thi - Ngày ' + new Date().toLocaleDateString('vi-VN')],
        [],
        ['Thứ tự', 'Sinh viên', 'Điểm', 'Câu Đúng', 'Thời gian', 'Ngày Tham gia']
    ];
    
    mockResults.forEach((result, idx) => {
        data.push([
            idx + 1,
            result.student,
            result.score,
            result.correct,
            result.time,
            result.date
        ]);
    });
    
    // Calculate average
    data.push([]);
    const avgScore = (mockResults.reduce((sum, r) => sum + r.score, 0) / mockResults.length).toFixed(2);
    data.push(['Điểm trung bình', '', avgScore]);
    data.push(['Tổng lần tham gia', '', mockResults.length]);
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    ws['!cols'] = [
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 }
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kết quả');
    XLSX.writeFile(wb, 'results_report.xlsx');
    alert('Xuất Excel thành công!');
}

// Setup export buttons
function setupExportButtons() {
    const pdfButton = Array.from(document.querySelectorAll('.btn-primary')).find(btn => btn.textContent.includes('PDF'));
    const excelButton = Array.from(document.querySelectorAll('.btn-primary')).find(btn => btn.textContent.includes('Excel'));
    
    if (pdfButton) {
        pdfButton.addEventListener('click', function() {
            const resultsPage = document.getElementById('resultsPage');
            if (resultsPage && resultsPage.classList.contains('active')) {
                exportResultsToPDF();
            }
        });
    }
    
    if (excelButton) {
        excelButton.addEventListener('click', function() {
            const resultsPage = document.getElementById('resultsPage');
            if (resultsPage && resultsPage.classList.contains('active')) {
                exportResultsToExcel();
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add exam button
    const addExamBtn = document.getElementById('addExamBtn');
    if (addExamBtn) {
        addExamBtn.addEventListener('click', function() {
            openExamEditor('add');
        });
    }
    
    setupExamFormSubmission();
    setupExportButtons();
}
