document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorDisplay = document.getElementById('error');
    const loginBtn = document.getElementById('loginBtn');
    
    // Reset error
    errorDisplay.style.display = 'none';

    // 1. Get Credentials
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        loginBtn.disabled = true;
        loginBtn.innerText = 'Logging in...';

        // 2. Call your Login Controller
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ SUCCESS: Save data to LocalStorage
            // Data includes token, roles, and username from your controller
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // 3. Redirect to Profile or Dashboard
            window.location.href = 'profile.html';
        } else {
            // ❌ ERROR (Invalid credentials or deactivated)
            errorDisplay.innerText = data.message || "Invalid email or password.";
            errorDisplay.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.innerText = 'Login';
        }

    } catch (err) {
        console.error("Login Error:", err);
        errorDisplay.innerText = "Connection failed. Please check your internet or server.";
        errorDisplay.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.innerText = 'Login';
    }
});
