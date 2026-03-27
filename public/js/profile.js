document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const profileContent = document.getElementById('profileContent');
    const loading = document.getElementById('loading');
    const errorDisplay = document.getElementById('error');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ FIX: Check if data is an array or an object
            const user = Array.isArray(data) ? data[0] : data;

            // ✅ VALIDATION: Ensure user exists before setting text
            if (!user) {
                throw new Error("User data not found in response");
            }

            document.getElementById('full_name').innerText = user.full_name || 'N/A';
            document.getElementById('username').innerText = user.username || 'N/A';
            document.getElementById('email').innerText = user.email || 'N/A';
            document.getElementById('department').innerText = user.department || 'Not set';
            document.getElementById('bio').innerText = user.bio || 'No bio yet';
            
            // Handle roles array correctly
            const rolesList = Array.isArray(user.roles) ? user.roles.join(', ') : 'Student';
            document.getElementById('roles').innerText = rolesList;

            loading.style.display = 'none';
            profileContent.style.display = 'block';
        } else {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }

    } catch (err) {
        console.error("Profile Fetch Error:", err);
        loading.style.display = 'none';
        errorDisplay.innerText = "Error: " + err.message;
        errorDisplay.style.display = 'block';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

//===================================================================================
//=======================================================================================

// --- Add this inside your DOMContentLoaded or at the bottom ---

// 1. Open Modal and Pre-fill data
document.getElementById('openEditBtn').addEventListener('click', () => {
    // Get current text values to show in the form
    document.getElementById('edit_full_name').value = document.getElementById('full_name').innerText;
    document.getElementById('edit_department').value = document.getElementById('department').innerText === 'Not set' ? '' : document.getElementById('department').innerText;
    document.getElementById('edit_bio').value = document.getElementById('bio').innerText === 'No bio yet' ? '' : document.getElementById('bio').innerText;
    // (Add github and student_id logic if you have those IDs in your HTML)
    
    document.getElementById('editModal').style.display = 'block';
});

// 2. Handle Form Submission
document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const saveBtn = document.getElementById('saveBtn');

    const updatedData = {
        full_name: document.getElementById('edit_full_name').value,
        student_id_number: document.getElementById('edit_student_id').value,
        department: document.getElementById('edit_department').value,
        github_url: document.getElementById('edit_github').value,
        bio: document.getElementById('edit_bio').value
    };

    try {
        saveBtn.disabled = true;
        saveBtn.innerText = "Saving...";

        const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT', // Ensure this matches your route (PUT or PATCH)
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Profile updated successfully!");
            location.reload(); // Refresh to show new data
        } else {
            alert(result.message || "Failed to update profile");
        }
    } catch (err) {
        console.error("Update Error:", err);
        alert("Connection error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "Save Changes";
    }
});
