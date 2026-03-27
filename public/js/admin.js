document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'login.html';

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const users = await response.json();
            renderUsers(users);
        } catch (err) {
            console.error("Error loading users:", err);
        }
    };

    const renderUsers = (users) => {
        const userList = document.getElementById('userList');
        userList.innerHTML = users.map(user => `
            <tr>
                <td>${user.full_name || user.username}</td>
                <td>${user.email}</td>
                <td>${user.is_active ? '✅ Active' : '❌ Deactivated'}</td>
                <td>
                    <button onclick="toggleStatus(${user.user_id}, ${user.is_active})">
                        ${user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            </tr>
        `).join('');
    };

    // ✅ TOGGLE STATUS FUNCTION
    window.toggleStatus = async (userId, currentStatus) => {
        const newStatus = !currentStatus; // Switch true to false or vice versa

        try {
            const response = await fetch(`http://localhost:5000/api/users/status/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: newStatus })
            });

            if (response.ok) {
                alert("User status updated!");
                fetchUsers(); // Refresh the list
            } else {
                const data = await response.json();
                alert(data.message || "Unauthorized: Superadmin only");
            }
        } catch (err) {
            alert("Network error occurred.");
        }
    };

    fetchUsers();
});

//========================================================================================================
//=======================================================================================================

async function loadMembers() {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('membersBody');

    try {
        const response = await fetch('http://localhost:5000/api/users/admin/all?limit=50&page=1', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const users = await response.json();

        if (response.ok) {
            tableBody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.full_name || 'N/A'}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                    <td style="color: ${user.is_active ? 'green' : 'red'}">
                        ${user.is_active ? 'Active' : 'Inactive'}
                    </td>
                </tr>
            `).join('');
        } else {
            alert(users.message || "Failed to load members");
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadMembers);
