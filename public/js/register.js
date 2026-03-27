document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Get DOM elements for messaging
    const errorDisplay = document.getElementById('error');
    const successDisplay = document.getElementById('success');
    const submitBtn = document.getElementById('submitBtn');

    // Reset messages
    errorDisplay.style.display = 'none';
    successDisplay.style.display = 'none';

    // 2. Collect data from inputs (matching your backend controller keys)
    const userData = {
        full_name: document.getElementById('full_name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value,
        password: document.getElementById('password').value
    };

    try {
        // Disable button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.innerText = 'Registering...';

        // 3. Make API call to your backend
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        // 4. Handle Response
        if (response.ok) {
            // SUCCESS
            successDisplay.innerText = "Registration successful! Redirecting to login...";
            successDisplay.style.display = 'block';
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // ERROR (e.g., Email already exists, validation failed)
            errorDisplay.innerText = data.message || "Registration failed. Please try again.";
            errorDisplay.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Register';
        }

    } catch (err) {
        // NETWORK ERROR (Server down)
        console.error("Fetch Error:", err);
        errorDisplay.innerText = "Connection error. Is the server running?";
        errorDisplay.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Register';
    }
});
