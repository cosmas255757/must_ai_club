const loadAllUsers = async () => {
    const userTableBody = document.getElementById("user-list");
    const token = localStorage.getItem("token");

    if (!userTableBody || !token) return;

    try {
        const response = await fetch("/api/auth/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            userTableBody.innerHTML = ""; // Clear static example rows

            result.data.forEach(user => {
                const row = document.createElement("tr");

                // Format Date
                const date = new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                });

                // Status Logic
                const statusClass = user.status === 'active' ? 'active-status' : 'suspended-status';
                
                row.innerHTML = `
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td><span class="role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                    <td><span class="status-indicator ${statusClass}"></span> ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</td>
                    <td>${date}</td>
                    <td>
                        <button class="action-btn" onclick="toggleUserStatus('${user.id}', '${user.status}')" title="Suspend/Activate">🚫</button>
                        <button class="action-btn" onclick="deleteUser('${user.id}')" title="Delete" style="color: #ef4444;">🗑️</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error loading users:", error);
    }
};

// Add this to your DOMContentLoaded block in admin_fetch.js
if (document.getElementById("user-list")) {
    loadAllUsers();
}
