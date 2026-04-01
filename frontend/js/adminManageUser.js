const loadAllUsers = async () => {
    const userTableBody = document.getElementById("user-list");
    const token = localStorage.getItem("token");

    // 1. Safety check for the HTML element
    if (!userTableBody) return;

    // 2. Initial Loading State (User Friendly)
    userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Fetching users... Please wait.</td></tr>`;

    if (!token) {
        userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Error: No admin token found. Please login again.</td></tr>`;
        return;
    }

    try {
        // 3. Fetch from Backend
        const response = await fetch("/api/auth/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            // 4. Handle Empty Database
            if (!result.data || result.data.length === 0) {
                userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">No users found in the database.</td></tr>`;
                return;
            }

            // 5. Clear table and Render Data
            userTableBody.innerHTML = ""; 

            result.data.forEach(user => {
                const row = document.createElement("tr");

                // Format Date: Nov 12, 2024
                const date = new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                });

                // Status Logic: active-status (green) vs suspended-status (red/gray)
                const statusClass = user.status === 'active' ? 'active-status' : 'suspended-status';
                const statusText = user.status.charAt(0).toUpperCase() + user.status.slice(1);
                
                // Role formatting
                const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1);

                row.innerHTML = `
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td><span class="role-badge ${user.role}">${roleText}</span></td>
                    <td><span class="status-indicator ${statusClass}"></span> ${statusText}</td>
                    <td>${date}</td>
                    <td>
                        <button class="action-btn" onclick="toggleUserStatus('${user.id}', '${user.status}')" title="${user.status === 'active' ? 'Suspend' : 'Activate'}">
                            ${user.status === 'active' ? '🚫' : '✅'}
                        </button>
                        <button class="action-btn" onclick="deleteUser('${user.id}')" title="Delete" style="color: #ef4444;">🗑️</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        } else {
            // Backend returned success: false
            userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Error: ${result.message}</td></tr>`;
        }
    } catch (error) {
        // Network or Server crash
        console.error("Fetch Error:", error);
        userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Connection Failed. Make sure the backend is running.</td></tr>`;
    }
};

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
    // Only trigger if we are on the User Management page
    if (document.getElementById("user-list")) {
        loadAllUsers();
    }
});
