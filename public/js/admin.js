document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('adminMembersBody');
    const searchInput = document.getElementById('memberSearch');

    // 1. Redirect if no token is found
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. ✅ FETCH ALL USERS (Initial Load)
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users/all?limit=50&offset=0', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });

            const result = await response.json();

            if (response.ok) {
                renderUsers(result.data);
            } else if (response.status === 401 || response.status === 403) {
                alert("Unauthorized: Admin access required.");
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error("Network error loading users:", err);
        }
    };

    // 3. ✅ DEBOUNCE LOGIC (Optimizes Search)
    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    // 4. ✅ SEARCH HANDLER
    const handleSearch = async (e) => {
        const query = e.target.value.trim();
        
        if (!query) {
            fetchUsers(); // If search is empty, show everyone
            return;
        }

        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (response.ok) {
                renderUsers(result.data);
            }
        } catch (err) {
            console.error("Search fetch error:", err);
        }
    };

    // 5. ✅ RENDER USERS TO TABLE (With Mobile Labels)
    const renderUsers = (users) => {
        if (!users || users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 3rem;">No members found matching your search.</td></tr>';
            return;
        }

        tableBody.innerHTML = users.map(user => `
            <tr>
                <td data-label="Full Name">${user.full_name || 'N/A'}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Student ID">${user.student_id_number || 'Not Set'}</td>
                <td data-label="Phone">${user.phone_number || 'N/A'}</td>
                <td data-label="Joined">${new Date(user.joined_date).toLocaleDateString()}</td>
                <td data-label="Status">
                    <span class="status-badge ${user.status ? 'active' : 'inactive'}">
                        ${user.status ? '✅ Active' : '❌ Deactivated'}
                    </span>
                </td>
                <td data-label="Action">
                    <button class="btn-toggle ${user.status ? 'deactivate' : 'activate'}" 
                            onclick="toggleStatus(${user.user_id}, ${user.status})">
                        ${user.status ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            </tr>
        `).join('');
    };

    // 6. ✅ TOGGLE STATUS (Global scope for button onclick)
    window.toggleStatus = async (userId, currentStatus) => {
        const newStatus = !currentStatus; 
        const actionText = newStatus ? 'activate' : 'deactivate';

        if (!confirm(`Are you sure you want to ${actionText} this member?`)) return;

        try {
            const response = await fetch(`/api/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: newStatus })
            });

            if (response.ok) {
                // Check if we are currently searching or viewing all
                const currentQuery = searchInput.value.trim();
                if (currentQuery) {
                    handleSearch({ target: { value: currentQuery } });
                } else {
                    fetchUsers();
                }
            } else {
                const result = await response.json();
                alert(result.message || "Failed to update status");
            }
        } catch (err) {
            alert("Network error occurred while updating status.");
        }
    };

    // 7. Initialize Listeners and Load Data
    searchInput.addEventListener('input', debounce(handleSearch));
    fetchUsers();
});
