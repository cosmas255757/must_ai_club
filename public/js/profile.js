document.addEventListener('DOMContentLoaded', async () => {
    const elements = {
        profileContent: document.getElementById('profileContent'),
        loading: document.getElementById('loading'),
        errorDisplay: document.getElementById('error'),
        logoutBtn: document.getElementById('logoutBtn')
    };

    const token = localStorage.getItem('token');

    // 1. Auth Guard
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // 2. Fetch Profile Data
        const response = await fetch('/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        // 3. Handle Unauthorized or Expired Token
        if (response.status === 401 || response.status === 403) {
            handleLogout();
            return;
        }

        if (response.ok && result.success) {
            const user = result.data;

            if (!user) throw new Error("User data object is empty");

            // 4. Map Standard Fields (Directly from SQL/Controller)
            setText('full_name', user.full_name);
            setText('username', user.username);
            setText('email', user.email);
            setText('phone_number', user.phone_number);
            setText('student_id_number', user.student_id_number);
            setText('department', user.department, 'Not set');
            setText('bio', user.bio, 'No bio provided');

            // 5. Link Logic (GitHub)
            const githubEl = document.getElementById('github_url');
            if (githubEl) {
                githubEl.innerHTML = user.github_url 
                    ? `<a href="${user.github_url}" target="_blank" style="color: #007bff;">${user.github_url}</a>`
                    : 'Not linked';
            }

            // 6. Role Logic (Superadmin + Array Join)
            const rolesArray = Array.isArray(user.roles) ? user.roles : [];
            let roleText = rolesArray.length > 0 ? rolesArray.join(', ') : 'Student';
            
            if (user.is_superadmin) {
                roleText = `⭐ Super Admin (${roleText})`;
            }
            setText('roles', roleText);

            // 7. Permissions Logic
            const permissionsArray = Array.isArray(user.permissions) ? user.permissions : [];
            setText('permissions', permissionsArray.join(', '), 'No specific permissions');

            // 8. Toggle Visibility
            elements.loading.style.display = 'none';
            elements.profileContent.style.display = 'block';

        } else {
            throw new Error(result.message || "Failed to load profile");
        }

    } catch (err) {
        console.error("Profile Fetch Error:", err);
        elements.loading.style.display = 'none';
        elements.errorDisplay.innerText = "Error: " + err.message;
        elements.errorDisplay.style.display = 'block';
    }

    // Helper: Set text content safely
    function setText(id, value, fallback = 'N/A') {
        const el = document.getElementById(id);
        if (el) el.innerText = value || fallback;
    }

    // Helper: Logout cleanup
    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    // Logout Event
    elements.logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
});

//===================================================================================
//=======================================================================================

// 1. Open Modal and Pre-fill data

document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById('editModal');
    const openEditBtn = document.getElementById('openEditBtn');
    const editForm = document.getElementById('editProfileForm');
    const token = localStorage.getItem('token');

    // 1. OPEN MODAL & PRE-FILL DATA
    openEditBtn?.addEventListener('click', () => {
        // Pull current values from the profile display fields
        document.getElementById('edit_username').value = document.getElementById('username').innerText.replace('N/A', '');
        document.getElementById('edit_email').value = document.getElementById('email').innerText.replace('N/A', '');
        document.getElementById('edit_phone_number').value = document.getElementById('phone_number').innerText.replace('N/A', '');
        document.getElementById('edit_full_name').value = document.getElementById('full_name').innerText.replace('N/A', '');
        document.getElementById('edit_student_id_number').value = document.getElementById('student_id_number').innerText.replace('N/A', '');
        document.getElementById('edit_department').value = document.getElementById('department').innerText.replace('Not set', '');
        document.getElementById('edit_bio').value = document.getElementById('bio').innerText.replace('No bio yet', '');
        
        // Extract URL from GitHub link if it exists
        const githubLink = document.querySelector('#github_url a');
        document.getElementById('edit_github_url').value = githubLink ? githubLink.href : '';

        editModal.style.display = 'block';
    });

    // 2. SUBMIT UPDATES TO BACKEND
    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = true;
        saveBtn.innerText = 'Saving...';

        const updatedData = {
            username: document.getElementById('edit_username').value,
            email: document.getElementById('edit_email').value,
            phone_number: document.getElementById('edit_phone_number').value,
            full_name: document.getElementById('edit_full_name').value,
            student_id_number: document.getElementById('edit_student_id_number').value,
            department: document.getElementById('edit_department').value,
            github_url: document.getElementById('edit_github_url').value,
            bio: document.getElementById('edit_bio').value
        };

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT', // Matches your backend update route
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Profile updated successfully!');
                location.reload(); // Refresh to show new data
            } else {
                // Display specific backend error (e.g., "Email already exists")
                alert('Error: ' + (result.message || 'Failed to update profile'));
            }
        } catch (err) {
            console.error('Update Error:', err);
            alert('A network error occurred. Please try again.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = 'Save Changes';
        }
    });

    // Close modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    };
});
