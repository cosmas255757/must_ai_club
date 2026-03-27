
document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS & STATE
    const rolesList = document.getElementById('rolesList');
    const createRoleForm = document.getElementById('createRoleForm');
    const createPermissionForm = document.getElementById('createPermissionForm');
    const permissionModal = document.getElementById('permissionModal');
    const permissionsChecklist = document.getElementById('permissionsChecklist');
    
    let selectedRoleId = null;
    const token = localStorage.getItem('token');
    const API_BASE = '/api/admin'; // Adjust based on your server.js mount point

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Initialize Page
    fetchRoles();

    // 2. CREATE ROLE (POST /roles)
    createRoleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            role_name: document.getElementById('role_name').value,
            description: document.getElementById('role_description').value
        };

        const res = await apiCall(`${API_BASE}/roles`, 'POST', data);
        if (res) {
            showToast('Role created!', 'success');
            createRoleForm.reset();
            fetchRoles();
        }
    });

    // 3. CREATE SYSTEM PERMISSION (POST /permissions)
    createPermissionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            permission_key: document.getElementById('perm_key').value,
            description: document.getElementById('perm_description').value
        };

        const res = await apiCall(`${API_BASE}/permissions`, 'POST', data);
        if (res) {
            showToast('Permission added to system!', 'success');
            createPermissionForm.reset();
        }
    });

    // 4. FETCH & RENDER ROLES (GET /roles)
    async function fetchRoles() {
        const roles = await apiCall(`${API_BASE}/roles`, 'GET');
        if (!roles) return;

        rolesList.innerHTML = '';
        roles.forEach(role => {
            const card = document.createElement('div');
            card.className = 'card role-card';
            card.innerHTML = `
                <div class="role-info">
                    <h4>${role.role_name}</h4>
                    <p>${role.description || 'No description'}</p>
                </div>
                <div class="role-actions">
                    <button class="btn-manage" onclick="openPermissionsModal(${role.role_id}, '${role.role_name}')">
                        Permissions
                    </button>
                    <button class="btn-delete" onclick="deleteRole(${role.role_id})">Delete</button>
                </div>
            `;
            rolesList.appendChild(card);
        });
    }

    // 5. DELETE ROLE (DELETE /roles/:id)
    window.deleteRole = async (id) => {
        if (!confirm('Delete this role? This affects all assigned users.')) return;
        const res = await apiCall(`${API_BASE}/roles/${id}`, 'DELETE');
        if (res) {
            showToast('Role removed', 'success');
            fetchRoles();
        }
    };

    // 6. MANAGE PERMISSIONS MODAL (Bridge Logic)
    window.openPermissionsModal = async (role_id, role_name) => {
        selectedRoleId = role_id;
        document.getElementById('modalRoleTitle').innerText = role_name;
        permissionModal.style.display = 'flex';
        permissionsChecklist.innerHTML = '<p>Loading permissions...</p>';

        try {
            // Get all system permissions AND what this role currently has
            const [allPerms, rolePerms] = await Promise.all([
                apiCall(`${API_BASE}/permissions`, 'GET'),
                apiCall(`${API_BASE}/roles/${role_id}/permissions`, 'GET') 
            ]);

            const currentIds = (rolePerms || []).map(p => p.permission_id);

            permissionsChecklist.innerHTML = '';
            allPerms.forEach(p => {
                const isChecked = currentIds.includes(p.permission_id) ? 'checked' : '';
                const div = document.createElement('div');
                div.className = 'checkbox-item';
                div.innerHTML = `
                    <label>
                        <input type="checkbox" value="${p.permission_id}" ${isChecked}>
                        <strong>${p.permission_key}</strong> - ${p.description || ''}
                    </label>
                `;
                permissionsChecklist.appendChild(div);
            });
        } catch (err) {
            permissionsChecklist.innerHTML = 'Failed to load permissions.';
        }
    };

    // 7. SAVE PERMISSION ASSIGNMENTS (POST /assign-permission)
    document.getElementById('savePermissionsBtn').addEventListener('click', async () => {
        const checkboxes = permissionsChecklist.querySelectorAll('input[type="checkbox"]');
        
        // Given your backend logic, we loop and assign.
        for (const cb of checkboxes) {
            if (cb.checked) {
                await apiCall(`${API_BASE}/assign-permission`, 'POST', {
                    role_id: selectedRoleId,
                    permission_id: cb.value
                });
            } else {
               
            }
        }
        showToast('Permissions synced!', 'success');
        closeModal();
    });

    // --- HELPER UTILITIES ---

    async function apiCall(url, method, body = null) {
        try {
            const options = {
                method,
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            if (body) options.body = JSON.stringify(body);

            const res = await fetch(url, options);
            const result = await res.json();
            
            if (!res.ok) throw new Error(result.message || 'API Error');
            return result;
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    }

    window.closeModal = () => permissionModal.style.display = 'none';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;
    document.getElementById('refreshRoles').onclick = fetchRoles;

    function showToast(msg, type) {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
});
