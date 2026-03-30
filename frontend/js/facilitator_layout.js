document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Facilitator" };
    const currentPath = window.location.pathname;

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary: #1e1b4b; /* Deep Indigo */
            --secondary: #312e81;
            --accent: #818cf8;
            --text-light: #f1f5f9;
            --danger: #ef4444;
            --sidebar-width: 260px;
        }

        * { box-sizing: border-box; transition: all 0.3s ease; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f8fafc; display: flex; flex-direction: column; min-height: 100vh; }

        .app-container { display: flex; flex: 1; }

        /* Sidebar */
        .sidebar { 
            width: var(--sidebar-width); background: var(--primary); color: white; 
            display: flex; flex-direction: column; padding: 30px 20px; height: 100vh; position: fixed; 
        }
        .sidebar h2 { color: var(--accent); font-size: 1.2rem; margin-bottom: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;}
        
        .sidebar nav a { 
            color: #94a3b8; text-decoration: none; padding: 14px 18px; margin: 8px 0; 
            border-radius: 12px; display: flex; align-items: center; gap: 12px; font-weight: 500;
        }
        .sidebar nav a:hover { color: white; background: var(--secondary); }
        .sidebar nav a.active { background: var(--accent); color: white; box-shadow: 0 4px 15px rgba(129, 140, 248, 0.4); }

        .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 40px; animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 992px) {
            .sidebar { transform: translateX(-100%); width: 100%; z-index: 1000; }
            .sidebar.active { transform: translateX(0); }
            .main-content { margin-left: 0; }
        }
    `;
    document.head.appendChild(style);

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
        <div class="app-container">
            <aside class="sidebar" id="sidebar">
                <h2>FACILITATOR PORTAL</h2>
                <nav>
                    <a href="dashboard" class="${currentPath.includes('dashboard') ? 'active' : ''}">🏠 Dashboard</a>
                    <a href="manage-courses" class="${currentPath.includes('manage-courses') ? 'active' : ''}">📚 My Courses</a>
                    <a href="review-projects" class="${currentPath.includes('review-projects') ? 'active' : ''}">⚖️ Review Projects</a>
                    <a href="announcements" class="${currentPath.includes('announcements') ? 'active' : ''}">📢 Announcements</a>
                    <a href="profile" class="${currentPath.includes('profile') ? 'active' : ''}">👤 Profile</a>
                </nav>
                <button style="margin-top:auto; background:none; border:1px solid var(--danger); color:var(--danger); padding:10px; border-radius:8px; cursor:pointer;" onclick="logout()">Logout</button>
            </aside>
            <main class="main-content">${originalContent}</main>
        </div>
    `;
});

function logout() { localStorage.clear(); window.location.href = "/auth"; }
