// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateUsername(username) {
    return username.length >= 3;
}

// ===== LOGIN VALIDATION =====
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    
    if (loginForm) {
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
            
            // Validate username
            if (!username) {
                usernameError.textContent = 'Vui lòng nhập tên đăng nhập';
                isValid = false;
            } else if (!validateUsername(username)) {
                usernameError.textContent = 'Tên đăng nhập phải có ít nhất 3 ký tự';
                isValid = false;
            }
            
            // Validate password
            if (!password) {
                passwordError.textContent = 'Vui lòng nhập mật khẩu';
                isValid = false;
            } else if (!validatePassword(password)) {
                passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Demo login - accept admin/admin123
            if (username === 'admin' && password === 'admin123') {
                loginMessage.className = 'login-message success';
                loginMessage.textContent = 'Đăng nhập thành công! Chuyển hướng...';
                
                // Store session
                localStorage.setItem('adminSession', JSON.stringify({
                    username: username,
                    loginTime: new Date().toISOString()
                }));
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                loginMessage.className = 'login-message error';
                loginMessage.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
            }
        });
    }
    
    // Check if already logged in
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession && window.location.pathname.includes('admin/login.html')) {
        window.location.href = 'dashboard.html';
    }
});
