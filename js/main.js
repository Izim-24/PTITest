// ===== INDEX PAGE LOGIN ===== 
document.addEventListener('DOMContentLoaded', function() {
    // Role switching
    const studentRole = document.getElementById('studentRole');
    const adminRole = document.getElementById('adminRole');
    const studentForm = document.getElementById('studentLoginForm');
    const adminForm = document.getElementById('adminLoginForm');
    
    if (studentRole && adminRole) {
        studentRole.addEventListener('click', function() {
            switchRole('student');
        });
        
        adminRole.addEventListener('click', function() {
            switchRole('admin');
        });
    }
    
    // Student login form
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('studentUsername').value.trim();
            const password = document.getElementById('studentPassword').value.trim();
            const usernameError = document.getElementById('studentUsernameError');
            const passwordError = document.getElementById('studentPasswordError');
            const loginMessage = document.getElementById('loginMessage');
            
            usernameError.textContent = '';
            passwordError.textContent = '';
            loginMessage.className = 'login-message';
            
            let isValid = true;
            
            if (!username) {
                usernameError.textContent = 'Vui lòng nhập tên đăng nhập';
                isValid = false;
            }
            
            if (!password) {
                passwordError.textContent = 'Vui lòng nhập mật khẩu';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Demo student accounts
            if (username === 'student' && password === 'student123') {
                loginMessage.className = 'login-message success';
                loginMessage.textContent = 'Đăng nhập thành công! Chuyển hướng...';
                
                localStorage.setItem('userSession', JSON.stringify({
                    username: username,
                    loginTime: new Date().toISOString(),
                    role: 'student'
                }));
                
                setTimeout(() => {
                    window.location.href = 'user/main.html';
                }, 1500);
            } else {
                loginMessage.className = 'login-message error';
                loginMessage.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
            }
        });
    }
    
    // Admin login form
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value.trim();
            const usernameError = document.getElementById('adminUsernameError');
            const passwordError = document.getElementById('adminPasswordError');
            const loginMessage = document.getElementById('loginMessage');
            
            usernameError.textContent = '';
            passwordError.textContent = '';
            loginMessage.className = 'login-message';
            
            let isValid = true;
            
            if (!username) {
                usernameError.textContent = 'Vui lòng nhập tên đăng nhập';
                isValid = false;
            }
            
            if (!password) {
                passwordError.textContent = 'Vui lòng nhập mật khẩu';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Demo admin account
            if (username === 'admin' && password === 'admin123') {
                loginMessage.className = 'login-message success';
                loginMessage.textContent = 'Đăng nhập thành công! Chuyển hướng...';
                
                localStorage.setItem('adminSession', JSON.stringify({
                    username: username,
                    loginTime: new Date().toISOString(),
                    role: 'admin'
                }));
                
                setTimeout(() => {
                    window.location.href = 'admin/dashboard.html';
                }, 1500);
            } else {
                loginMessage.className = 'login-message error';
                loginMessage.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
            }
        });
    }
    
    // Register link
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Trang đăng ký sẽ được cập nhật sớm!');
        });
    }
});

// Switch between student and admin role
function switchRole(role) {
    const studentRole = document.getElementById('studentRole');
    const adminRole = document.getElementById('adminRole');
    const studentForm = document.getElementById('studentLoginForm');
    const adminForm = document.getElementById('adminLoginForm');
    
    if (role === 'student') {
        studentRole.classList.add('active');
        adminRole.classList.remove('active');
        studentForm.classList.add('active-form');
        adminForm.classList.remove('active-form');
    } else {
        adminRole.classList.add('active');
        studentRole.classList.remove('active');
        adminForm.classList.add('active-form');
        studentForm.classList.remove('active-form');
    }
}

function startExam() {
    alert('Bắt đầu thi');
}
