// 1. Global State
let allUsers = [];
let searchTimeout;

// 2. Core Data Fetching Function
const loadAllUsers = async () => {
    const userTableBody = document.getElementById("user-list");
    const token = localStorage.getItem("token");

    if (!userTableBody) return;

    // Loading State
    userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Fetching users... Please wait.</td></tr>`;

    if (!token) {
        userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Error: No admin token found. Please login again.</td></tr>`;
        return;
    }

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
            allUsers = result.data || [];
            renderUserTable(allUsers);
        } else {
            userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Error: ${result.message}</td></tr>`;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; padding: 20px;">Connection Failed. Make sure the backend is running.</td></tr>`;
    }
};

// 3. Rendering Logic
const renderUserTable = (usersToDisplay) => {
    const userTableBody = document.getElementById("user-list");
    if (!userTableBody) return;

    userTableBody.innerHTML = "";

    if (!usersToDisplay || usersToDisplay.length === 0) {
        userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">No matching users found.</td></tr>`;
        return;
    }

    usersToDisplay.forEach(user => {
        const row = document.createElement("tr");

        const date = new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        const statusClass = user.status === 'active' ? 'active-status' : 'suspended-status';
        const statusText = user.status.charAt(0).toUpperCase() + user.status.slice(1);
        const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1);

        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role.toLowerCase()}">${roleText}</span></td>
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
};

// 4. Search & Filter Logic
const handleSearch = () => {
    const searchEl = document.getElementById("user-search");
    const roleEl = document.getElementById("role-filter");
    const token = localStorage.getItem("token");

    const query = searchEl ? searchEl.value.trim() : "";
    const roleValue = roleEl ? roleEl.value.toLowerCase() : "all";

    clearTimeout(searchTimeout);

    if (query === "") {
        filterUsersLocal();
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/api/auth/users/search?q=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.success) {
                const filtered = result.data.filter(u => roleValue === "all" || u.role.toLowerCase() === roleValue);
                renderUserTable(filtered);
            }
        } catch (error) {
            console.error("Search Error:", error);
            filterUsersLocal();
        }
    }, 300);
};

const filterUsersLocal = () => {
    const searchEl = document.getElementById("user-search");
    const roleEl = document.getElementById("role-filter");

    const searchTerm = searchEl ? searchEl.value.toLowerCase() : "";
    const roleTerm = roleEl ? roleEl.value.toLowerCase() : "all";

    const filtered = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = roleTerm === "all" || user.role.toLowerCase() === roleTerm;
        return matchesSearch && matchesRole;
    });

    renderUserTable(filtered);
};

// 5. Action Functions
window.toggleUserStatus = async (userId, currentStatus) => {
    const actionText = currentStatus === 'active' ? 'SUSPEND' : 'ACTIVATE';
    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`/api/auth/users/${userId}/status`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ currentStatus })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            loadAllUsers();
        }
    } catch (error) {
        alert("Failed to update status.");
    }
};

window.deleteUser = async (userId) => {
    if (!confirm("CRITICAL: Permanently delete this user?")) return;

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`/api/auth/users/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (result.success) {
            alert("User removed.");
            loadAllUsers();
        }
    } catch (error) {
        alert("Delete failed.");
    }
};

// 6. Modal & Form Logic
window.openModal = () => {
    const modal = document.getElementById("userModal");
    if (modal) modal.style.display = "flex";
};

window.closeModal = () => {
    const modal = document.getElementById("userModal");
    const form = document.getElementById("adminCreateUserForm");
    if (modal) modal.style.display = "none";
    if (form) form.reset();
};

const handleAdminCreateUser = async (e) => {
    e.preventDefault();

    const name = document.getElementById("admin-name").value;
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;
    const role = document.getElementById("admin-role").value;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("/api/admin/register-admin", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const result = await response.json();
        if (result.success) {
            alert("User created successfully!");
            closeModal();
            loadAllUsers();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Failed to create user.");
    }
};

// 7. Initialization
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("user-list")) {
        loadAllUsers();

        document.getElementById("user-search")?.addEventListener("input", handleSearch);
        document.getElementById("role-filter")?.addEventListener("change", handleSearch);
        document.getElementById("adminCreateUserForm")?.addEventListener("submit", handleAdminCreateUser);
    }
});
