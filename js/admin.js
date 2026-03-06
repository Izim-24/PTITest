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
                window.location.href = '../index.html';
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
    alert('Chỉnh sửa kỳ thi ID: ' + id);
}

// Delete exam
function deleteExam(id) {
    if (confirm('Bạn chắc chắn muốn xóa kỳ thi này?')) {
        alert('Xóa kỳ thi ID: ' + id);
        loadExamsTable();
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
