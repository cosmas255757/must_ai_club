const token = localStorage.getItem('token');
const API_URL = 'http://localhost:5000/api/rbac';

// Global variable to hold roles for searching
let allRoles = [];

if (!token) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadRoles();
    
    // ✅ HANDLE CREATE ROLE
    document.getElementById('createRoleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const role_name = document.getElementById('role_name').value;
        const description = document.getElementById('role_description').value;
        const submitBtn = e.target.querySelector('button');

        try {
            submitBtn.disabled = true;
            const response = await fetch(`${API_URL}/roles`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ role_name, description })
            });

            if (response.ok) {
                alert('Role created successfully!');
                e.target.reset(); // Clear form
                loadRoles(); // Reload grid
            } else {
                const err = await response.json();
                alert(err.message || 'Error creating role');
            }
        } catch (err) {
            alert('Server connection failed');
        } finally {
            submitBtn.disabled = false;
        }
    });

    // ✅ HANDLE SEARCH (If you add a search input with id="roleSearch")
    const searchInput = document.getElementById('roleSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allRoles.filter(r => 
                r.role_name.toLowerCase().includes(term) || 
                (r.description && r.description.toLowerCase().includes(term))
            );
            renderRoleCards(filtered);
        });
    }
});

// ✅ GET ALL ROLES & STORE THEM
async function loadRoles() {
    const list = document.getElementById('rolesList');
    try {
        const response = await fetch(`${API_URL}/roles`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allRoles = await response.json();
        renderRoleCards(allRoles);
    } catch (err) {
        list.innerHTML = `<p class="error">Failed to load roles.</p>`;
    }
}

// ✅ RENDER ROLES AS USER-FRIENDLY CARDS (No IDs visible)
function renderRoleCards(roles) {
    const list = document.getElementById('rolesList');
    
    if (roles.length === 0) {
        list.innerHTML = "<p>No roles found.</p>";
        return;
    }

    list.innerHTML = roles.map(role => `
        <div class="role-card">
            <div class="role-info">
                <h4>${role.role_name}</h4>
                <p>${role.description || '<em>No description provided.</em>'}</p>
            </div>
            <div class="btn-group">
                <button class="btn-outline" onclick="managePermissions(${role.role_id}, '${role.role_name}')">
                    🛡️ Permissions
                </button>
                <button class="btn-danger" onclick="deleteRole(${role.role_id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// ✅ DELETE ROLE (Safe Delete)
async function deleteRole(id) {
    if (!confirm('Warning: Deleting this role will revoke it from all club members. Proceed?')) return;
    
    try {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadRoles();
        } else {
            alert('Failed to delete role.');
        }
    } catch (err) {
        alert('Connection error.');
    }
}

// ✅ OPEN PERMISSION MODAL & SYNC DATA
async function managePermissions(roleId, roleName) {
    document.getElementById('modalRoleTitle').innerText = `Manage Permissions: ${roleName}`;
    document.getElementById('permissionModal').style.display = 'flex'; // Use flex to center
    
    const checklist = document.getElementById('permissionsChecklist');
    checklist.innerHTML = "<p>Loading permissions...</p>";

    try {
        // Fetch all system permissions and this role's active permissions simultaneously
        const [allPermsRes, activePermsRes] = await Promise.all([
            fetch(`${API_URL}/permissions`, { headers: { 'Authorization': `Bearer ${token}` }}),
            fetch(`${API_URL}/roles/${roleId}/permissions`, { headers: { 'Authorization': `Bearer ${token}` }})
        ]);

        const allPerms = await allPermsRes.json();
        const activePerms = await activePermsRes.json();
        
        checklist.innerHTML = allPerms.map(p => {
            const isChecked = activePerms.some(ap => ap.permission_id === p.permission_id);
            return `
                <div class="permission-item">
                    <input type="checkbox" id="perm_${p.permission_id}" ${isChecked ? 'checked' : ''} 
                        onchange="togglePermission(${roleId}, ${p.permission_id}, this.checked)">
                    <label for="perm_${p.permission_id}">
                        <strong>${p.permission_key}</strong>
                        <span>${p.description || ''}</span>
                    </label>
                </div>
            `;
        }).join('');
    } catch (err) {
        checklist.innerHTML = "<p>Error loading permissions list.</p>";
    }
}

// ✅ ATOMIC ASSIGN/REMOVE PERMISSION
async function togglePermission(roleId, permissionId, shouldAdd) {
    try {
        const method = shouldAdd ? 'POST' : 'DELETE';
        // Your controller endpoint for removal is /role-permission/:roleId/:permissionId
        const endpoint = shouldAdd 
            ? `${API_URL}/assign-permission` 
            : `${API_URL}/role-permission/${roleId}/${permissionId}`;
        
        const response = await fetch(endpoint, {
            method: method,
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: shouldAdd ? JSON.stringify({ role_id: roleId, permission_id: permissionId }) : null
        });

        if (!response.ok) {
            alert('Failed to update permission. Please try again.');
            loadRoles(); // Refresh to reset checkbox state
        }
    } catch (err) {
        alert('Network error while updating permissions.');
    }
}

function closeModal() {
    document.getElementById('permissionModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('permissionModal');
    if (event.target == modal) {
        closeModal();
    }
}
