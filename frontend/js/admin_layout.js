document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #0f172a; /* Midnight Slate */
            --secondary: #1e293b;
            --accent: #ef4444; /* Alert Red */
            --text-light: #f8fafc;
            --sidebar-width: 260px;
        }

        * { box-sizing: border-box; transition: all 0.2s ease; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f1f5f9; display: flex; flex-direction: column; min-height: 100vh; }

        .app-container { display: flex; flex: 1; }

        /* Sidebar */
        .sidebar { 
            width: var(--sidebar-width); background: var(--primary); color: white; 
            display: flex; flex-direction: column; padding: 30px 20px; height: 100vh; position: fixed; 
        }
        .sidebar h2 { color: var(--accent); font-size: 1.1rem; margin-bottom: 40px; text-align: center; letter-spacing: 2px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;}
        
        .sidebar nav a { 
            color: #94a3b8; text-decoration: none; padding: 14px 18px; margin: 8px 0; 
            border-radius: 12px; display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem;
        }
        .sidebar nav a:hover { color: white; background: var(--secondary); }
        .sidebar nav a.active { background: var(--accent); color: white; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); }

        .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 40px; }
    `;
    document.head.appendChild(style);

    document.body.innerHTML = `
        <div class="app-container">
            <aside class="sidebar">
                <h2>ADMIN COMMAND</h2>
                <nav>
                    <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">🛡️ System Overview</a>
                    <a href="user-management" class="${currentPath.includes('user-management') ? 'active' : ''}">👥 User Management</a>
                    <a href="activity-logs" class="${currentPath.includes('activity-logs') ? 'active' : ''}">📜 Activity Logs</a>
                    <a href="system-reports" class="${currentPath.includes('system-reports') ? 'active' : ''}">📈 System Reports</a>
                    <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Admin Profile</a>
                </nav>
                <button style="margin-top:auto; background:var(--accent); border:none; color:white; padding:12px; border-radius:10px; cursor:pointer; font-weight:bold;" onclick="logout()">Terminate Session</button>
            </aside>
            <main class="main-content">${document.body.innerHTML}</main>
        </div>
    `;
});

function logout() { localStorage.clear(); window.location.href = "/auth"; }
