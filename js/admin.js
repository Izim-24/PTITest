// ===== ADMIN DASHBOARD FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession && !window.location.pathname.includes('admin/login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Parse admin data
    if (adminSession) {
        const admin = JSON.parse(adminSession);
        const adminNameEl = document.getElementById('adminName');
        if (adminNameEl) {
            adminNameEl.textContent = admin.username.charAt(0).toUpperCase() + admin.username.slice(1);
        }
    }
    
    // Navigation
    initializeNavigation();
    
    // Logout
    initializeLogout();
    
    // Search functionality
    initializeSearch();
});

// Initialize sidebar navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Get page to show
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
}

// Show page content
function showPage(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(page + 'Page');
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    const pageNames = {
        'dashboard': 'Dashboard',
        'exams': 'Quản lý Kỳ thi',
        'users': 'Quản lý Người dùng',
        'results': 'Thống kê Kết quả',
        'studentResults': 'Kết quả Sinh viên'
    };
    
    if (pageTitle) {
        pageTitle.textContent = pageNames[page] || 'Dashboard';
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

// Initialize search functionality
function initializeSearch() {
    // Exam search
    const examSearch = document.getElementById('examSearch');
    if (examSearch) {
        examSearch.addEventListener('input', function() {
            filterTable('examsTableBody', this.value);
        });
    }
    
    // User search
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            filterTable('usersTableBody', this.value);
        });
    }
    
    // Student search
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', function() {
            filterTable('studentDetailsBody', this.value);
        });
    }
}

// Filter table rows
function filterTable(tableBodyId, searchTerm) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    const term = searchTerm.toLowerCase().trim();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Edit exam button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-edit')) {
        alert('Chức năng chỉnh sửa sẽ được cập nhật sớm!');
    }
    
    // Delete buttons
    if (e.target.classList.contains('btn-delete')) {
        if (confirm('Bạn chắc chắn muốn xóa?')) {
            e.target.closest('tr').remove();
            alert('Đã xóa thành công!');
        }
    }
    
    // Add exam button
    if (e.target.id === 'addExamBtn') {
        alert('Chức năng thêm kỳ thi sẽ được cập nhật sớm!');
    }
    
    // Add user button
    if (e.target.id === 'addUserBtn') {
        alert('Chức năng thêm người dùng sẽ được cập nhật sớm!');
    }
    
    // Export buttons
    if (e.target.textContent.includes('Xuất PDF')) {
        alert('Chức năng xuất PDF sẽ được cập nhật sớm!');
    }
    
    if (e.target.textContent.includes('Xuất Excel')) {
        alert('Chức năng xuất Excel sẽ được cập nhật sớm!');
    }
});
