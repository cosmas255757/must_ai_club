document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const API_URL = "/api/auth"; 

    // -------------------------
    // HANDLE LOGIN
    // -------------------------
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                const role = data.user.role;

                if (role === 'admin') {
                    window.location.href = "/admin/dashboard.html"; 
                } 
                else if (role === 'facilitator') {
                    window.location.href = "/facilitator/dashboard.html";
                } 
                else if (role === 'sponsor') {
                    window.location.href = "/sponsor/dashboard.html";
                } 
                else if (role === 'student') {
                    window.location.href = "/student/dashboard.html";
                } 
                else {
                    window.location.href = "/index.html"; 
                }
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Server connection error.");
        }
    });

    // -------------------------
    // HANDLE REGISTRATION
    // -------------------------
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! Please sign in.");
                showLogin(); // the function from auth.html
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Register Error:", error);
            alert("Server connection error.");
        }
    });
});
