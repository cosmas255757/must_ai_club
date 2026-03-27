const token = localStorage.getItem('token');
const API_URL = 'http://localhost:5000/api/rbac';
let allPermissions = [];

if (!token) window.location.href = 'login.html';

document.addEventListener('DOMContentLoaded', () => {
    loadPermissions();

    // ✅ HANDLE CREATE
    document.getElementById('createPermissionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const key = document.getElementById('permission_key').value.trim().toUpperCase();
        const description = document.getElementById('permission_description').value;

        const response = await fetch(`${API_URL}/permissions`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ permission_key: key, description })
        });

        if (response.ok) {
            e.target.reset();
            loadPermissions();
        } else {
            const data = await response.json();
            alert(data.message || "Error saving permission");
        }
    });

    // ✅ HANDLE SEARCH
    document.getElementById('permSearch').addEventListener('input', (e) => {
        const term = e.target.value.toUpperCase();
        const filtered = allPermissions.filter(p => p.permission_key.includes(term));
        renderPermissions(filtered);
    });
});

// ✅ FETCH ALL
async function loadPermissions() {
    try {
        const response = await fetch(`${API_URL}/permissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allPermissions = await response.json();
        renderPermissions(allPermissions);
    } catch (err) {
        console.error(err);
    }
}

// ✅ RENDER LIST
function renderPermissions(perms) {
    const container = document.getElementById('permissionList');
    
    if (perms.length === 0) {
        container.innerHTML = "<p>No permissions found.</p>";
        return;
    }

    container.innerHTML = perms.map(p => `
        <div class="perm-item">
            <div class="perm-info">
                <code>${p.permission_key}</code>
                <span>${p.description || 'No description'}</span>
            </div>
            <div class="perm-actions">
                <button class="btn-danger-sm" onclick="deletePermission(${p.permission_id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// ✅ DELETE (Trigger Global Cleanup)
async function deletePermission(id) {
    if (!confirm("Caution: Deleting a key removes it from ALL roles. Continue?")) return;

    const response = await fetch(`${API_URL}/permissions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) loadPermissions();
}
