document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on by form IDs
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            const errorMsg = document.getElementById('login-error');

            // Mock authentication rules
            if ((user === '' && pass === '') || (user === 'test' && pass === '123456')) {
                errorMsg.textContent = '';
                // Set mock token and redirect to main application
                localStorage.setItem('auth_token', 'mock_token_123');
                window.location.href = 'index.html';
            } else {
                errorMsg.textContent = '用户名或密码错误。默认空密码或使用 test/123456。';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('reg-password').value;
            const passConfirm = document.getElementById('reg-password-confirm').value;

            if (pass !== passConfirm) {
                alert('两次输入的密码不一致！');
                return;
            }
            
            // Mock register success
            alert('注册成功！(演示环境)');
            localStorage.setItem('auth_token', 'mock_token_123'); // Auto-login after registration
            window.location.href = 'index.html';
        });
    }
});
